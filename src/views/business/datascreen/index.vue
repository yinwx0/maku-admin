<template>
	<div ref="dashboardContainer" class="dashboard-container">
		<!-- 顶部操作栏 -->
		<div class="dashboard-header">
			<h1>企业数据监控平台</h1>
			<div class="header-actions">
				<el-button circle size="small" :title="isFullscreen ? '退出全屏' : '全屏显示'" @click="toggleFullscreen">
					<i v-if="isFullscreen" class="el-icon-close" />
					<i v-else class="el-icon-full-screen" />
				</el-button>
				<span class="current-time">{{ currentTime }}</span>
			</div>
		</div>

		<!-- 顶部租户统计卡片 -->
		<el-row :gutter="20" class="stats-row">
			<el-col :span="6">
				<el-card class="stat-card">
					<div class="stat-title">总租户数</div>
					<div class="stat-value">{{ totalTenants }}</div>
				</el-card>
			</el-col>
			<el-col :span="6">
				<el-card class="stat-card">
					<div class="stat-title">已激活租户</div>
					<div class="stat-value success">{{ activatedCount }}</div>
				</el-card>
			</el-col>
			<el-col :span="6">
				<el-card class="stat-card">
					<div class="stat-title">未激活租户</div>
					<div class="stat-value warning">{{ inactivatedCount }}</div>
				</el-card>
			</el-col>
			<el-col :span="6">
				<el-card class="stat-card">
					<div class="stat-title">租户用户数</div>
					<div class="stat-value">{{ userCount }}</div>
				</el-card>
			</el-col>
		</el-row>

		<!-- 设备统计卡片 -->
		<el-row :gutter="20" class="stats-row">
			<el-col :span="6">
				<el-card class="stat-card">
					<div class="stat-title">设备总数</div>
					<div class="stat-value">{{ deviceTotal }}</div>
				</el-card>
			</el-col>
			<el-col :span="6">
				<el-card class="stat-card">
					<div class="stat-title">运行中设备</div>
					<div class="stat-value success">{{ runningDevices }}</div>
				</el-card>
			</el-col>
			<el-col :span="6">
				<el-card class="stat-card">
					<div class="stat-title">离线设备</div>
					<div class="stat-value warning">{{ offlineDevices }}</div>
				</el-card>
			</el-col>
			<el-col :span="6">
				<el-card class="stat-card">
					<div class="stat-title">平均温度</div>
					<div class="stat-value">{{ avgTemperature }}°C</div>
				</el-card>
			</el-col>
		</el-row>

		<!-- 图表区域 -->
		<el-row :gutter="20" class="charts-row">
			<!-- 租户状态分布图 -->
			<el-col :span="8">
				<el-card>
					<div class="chart-title">租户状态分布</div>
					<div ref="tenantStatusChart" style="height: 400px"></div>
				</el-card>
			</el-col>

			<!-- 设备运行状态分布图 -->
			<el-col :span="8">
				<el-card>
					<div class="chart-title">设备运行状态分布</div>
					<div ref="deviceStatusChart" style="height: 400px"></div>
				</el-card>
			</el-col>

			<!-- 设备类型分布图 -->
			<el-col :span="8">
				<el-card>
					<div class="chart-title">设备类型分布</div>
					<div ref="deviceTypeChart" style="height: 400px"></div>
				</el-card>
			</el-col>
		</el-row>

		<!-- 温度监控区域 -->
		<el-row :gutter="20" class="charts-row">
			<el-col :span="24">
				<el-card>
					<div class="chart-title">设备温度监控 (每页显示: {{ tempPageSize }})</div>
					<div ref="tempChart" style="height: 400px"></div>
					<div class="pagination-dots">
						<span
							v-for="(page, index) in tempPages"
							:key="index"
							:class="['dot', { active: tempCurrentPage === index }]"
							@click="switchTempPage(index)"
						></span>
					</div>
				</el-card>
			</el-col>
		</el-row>

		<!-- 设备列表 -->
		<el-card class="tenant-table">
			<div class="chart-title">设备列表 ({{ devices.length }})</div>
			<el-table :data="devices" height="400" style="width: 100%">
				<el-table-column prop="name" label="设备名称" width="180" />
				<el-table-column prop="type" label="设备类型" width="120">
					<template #default="scope">
						{{ getDeviceType(scope.row.type) }}
					</template>
				</el-table-column>
				<el-table-column prop="runningStatus" label="运行状态" width="120">
					<template #default="scope">
						<el-tag :type="scope.row.runningStatus === 1 ? 'success' : 'danger'">
							{{ getRunningStatus(scope.row.runningStatus) }}
						</el-tag>
					</template>
				</el-table-column>
				<el-table-column prop="temperature" label="温度" width="100">
					<template #default="scope">
						<span :class="{ 'warning-text': scope.row.temperature > 40 }"> {{ scope.row.temperature }}°C </span>
					</template>
				</el-table-column>
				<el-table-column prop="tenantName" label="所属租户" />
			</el-table>
		</el-card>
	</div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, onBeforeUnmount, nextTick } from 'vue'
import * as echarts from 'echarts'
import service from '@/utils/request'

// 获取页面容器引用
const dashboardContainer = ref<HTMLElement>()

// 图表DOM引用
const tenantStatusChart = ref<HTMLElement>()
const deviceStatusChart = ref<HTMLElement>()
const deviceTypeChart = ref<HTMLElement>()
const tempChart = ref<HTMLElement>()

// 全屏状态
const isFullscreen = ref(false)

// 当前时间
const currentTime = ref('')

// 租户数据状态
const state = reactive({
	dataList: [] as any[],
	loading: false
})

// 租户统计指标
const totalTenants = ref(0)
const activatedCount = ref(0)
const inactivatedCount = ref(0)
const userCount = ref(0) // 租户下的总用户数

// 设备数据状态
const devices = ref<any[]>([])
const deviceTotal = ref(0)
const runningDevices = ref(0)
const offlineDevices = ref(0)
const avgTemperature = ref(0)

// 温度图表分页相关
const tempCurrentPage = ref(0)
const tempPageSize = ref(10)
const tempPages = ref(0)
let tempInterval: number | null = null

// 更新时间显示
const updateTime = () => {
	const now = new Date()
	currentTime.value = now.toLocaleString('zh-CN', {
		year: 'numeric',
		month: '2-digit',
		day: '2-digit',
		hour: '2-digit',
		minute: '2-digit',
		second: '2-digit',
		hour12: false
	})
}

// 全屏切换功能
const toggleFullscreen = () => {
	if (!dashboardContainer.value) {
		return
	}

	if (!isFullscreen.value) {
		// 进入全屏
		const element = dashboardContainer.value
		if (element.requestFullscreen) {
			element.requestFullscreen()
		} else if ((element as any).mozRequestFullScreen) {
			;(element as any).mozRequestFullScreen()
		} else if ((element as any).webkitRequestFullscreen) {
			;(element as any).webkitRequestFullscreen()
		} else if ((element as any).msRequestFullscreen) {
			;(element as any).msRequestFullscreen()
		}
	} else {
		// 退出全屏
		if (document.exitFullscreen) {
			document.exitFullscreen()
		} else if ((document as any).mozCancelFullScreen) {
			;(document as any).mozCancelFullScreen()
		} else if ((document as any).webkitExitFullscreen) {
			;(document as any).webkitExitFullscreen()
		} else if ((document as any).msExitFullscreen) {
			;(document as any).msExitFullscreen()
		}
	}
}

// 监听全屏变化事件
const handleFullscreenChange = () => {
	isFullscreen.value = !!(
		document.fullscreenElement ||
		(document as any).webkitFullscreenElement ||
		(document as any).mozFullScreenElement ||
		(document as any).msFullscreenElement
	)

	// 全屏状态变化时重绘所有图表
	nextTick(() => {
		setTimeout(() => {
			const charts = [tenantStatusChart.value, deviceStatusChart.value, deviceTypeChart.value, tempChart.value]

			charts.forEach(chartRef => {
				if (chartRef) {
					const chartInstance = echarts.getInstanceByDom(chartRef)
					if (chartInstance) {
						chartInstance.resize()
					} else {
						console.warn('图表实例未找到:', chartRef)
					}
				}
			})
		}, 300)
	})
}

// 获取租户数据
const fetchTenantData = async () => {
	try {
		state.loading = true
		const res = await service.get('/new/business/tenant/page', {
			params: { page: 1, limit: 100 }
		})

		if (res.data?.list) {
			state.dataList = res.data.list
			calculateStats(res.data.list)
			renderTenantStatusChart()
		}
	} catch (error) {
		console.error('获取租户数据失败:', error)
	} finally {
		state.loading = false
	}
}

// 计算租户统计数据
const calculateStats = (data: any[]) => {
	totalTenants.value = data.length
	activatedCount.value = data.filter(item => item.status === 1).length
	inactivatedCount.value = data.filter(item => item.status === 0).length

	// 计算租户下的总用户数（假设每个租户有userCount字段）
	userCount.value = data.reduce((sum, tenant) => sum + (tenant.userCount || 1), 0)
}

// 获取设备数据
const fetchDeviceData = async () => {
	try {
		const res = await service.get('/business/device/page', {
			params: { page: 1, limit: 100 }
		})

		if (res.data?.list) {
			devices.value = res.data.list.map((device: any) => ({
				...device,
				// 确保温度转换为数字类型
				temperature: parseFloat(device.temperature) || 0
			}))

			calculateDeviceStats(devices.value)
			nextTick(() => {
				renderDeviceCharts()
			})
			initTempPagination(devices.value)
		}
	} catch (error) {
		console.error('获取设备数据失败:', error)
	}
}

// 计算设备统计数据
const calculateDeviceStats = (data: any[]) => {
	deviceTotal.value = data.length
	runningDevices.value = data.filter(item => item.runningStatus == 1).length
	offlineDevices.value = data.filter(item => item.runningStatus == 0).length

	// 计算平均温度
	const totalTemp = data.reduce((sum, device) => sum + (device.temperature || 0), 0)
	avgTemperature.value = data.length ? parseFloat((totalTemp / data.length).toFixed(1)) : 0
}

// 初始化温度图表分页
const initTempPagination = (data: any[]) => {
	const sortedData = [...data].sort((a, b) => b.temperature - a.temperature)
	const pageCount = Math.ceil(sortedData.length / tempPageSize.value)
	tempPages.value = pageCount

	// 清除现有定时器
	if (tempInterval !== null) {
		window.clearInterval(tempInterval)
	}

	// 启动新定时器
	if (pageCount > 1) {
		tempInterval = window.setInterval(() => {
			tempCurrentPage.value = (tempCurrentPage.value + 1) % pageCount
			renderTempChart()
		}, 5000)
	}
}

// 切换温度分页
const switchTempPage = (index: number) => {
	tempCurrentPage.value = index
	renderTempChart()
}

// 渲染租户状态分布图
const renderTenantStatusChart = () => {
	if (!tenantStatusChart.value) {
		return
	}

	try {
		const chart = echarts.init(tenantStatusChart.value)
		const option = {
			title: {
				text: '租户状态分布',
				left: 'center'
			},
			tooltip: {
				trigger: 'item',
				formatter: '{a} <br/>{b}: {c} ({d}%)'
			},
			legend: {
				orient: 'vertical',
				right: 10,
				top: 'center',
				data: ['已激活租户', '未激活租户', '租户用户']
			},
			color: ['#67C23A', '#E6A23C', '#409EFF'],
			series: [
				{
					name: '租户状态',
					type: 'pie',
					radius: ['40%', '70%'],
					center: ['40%', '50%'],
					avoidLabelOverlap: false,
					label: {
						show: true,
						formatter: '{b}: {c}'
					},
					emphasis: {
						label: {
							show: true,
							fontSize: 14,
							fontWeight: 'bold'
						}
					},
					data: [
						{ value: activatedCount.value, name: '已激活租户' },
						{ value: inactivatedCount.value, name: '未激活租户' },
						{ value: userCount.value, name: '租户用户' }
					]
				}
			]
		}

		chart.setOption(option)

		// 响应式调整
		const resizeHandler = () => chart.resize()
		window.addEventListener('resize', resizeHandler)

		// 保存清理函数
		onBeforeUnmount(() => {
			window.removeEventListener('resize', resizeHandler)
			chart.dispose()
		})
	} catch (e) {
		console.error('租户状态图表渲染失败:', e)
	}
}

// 渲染设备状态分布图
const renderDeviceStatusChart = () => {
	if (!deviceStatusChart.value) {
		return
	}

	try {
		const chart = echarts.init(deviceStatusChart.value)
		const option = {
			title: {
				text: '设备运行状态',
				left: 'center'
			},
			tooltip: {
				trigger: 'item',
				formatter: '{a} <br/>{b}: {c} ({d}%)'
			},
			legend: {
				orient: 'horizontal',
				bottom: 10,
				data: ['运行中', '离线'],
				textStyle: { color: '#606266' }
			},
			color: ['#67C23A', '#F56C6C'],
			series: [
				{
					name: '设备状态',
					type: 'pie',
					radius: ['40%', '70%'],
					center: ['50%', '45%'],
					avoidLabelOverlap: false,
					label: {
						show: true,
						formatter: '{b}: {c} ({d}%)'
					},
					emphasis: {
						label: {
							show: true,
							fontSize: 14,
							fontWeight: 'bold'
						}
					},
					data: [
						{ value: runningDevices.value, name: '运行中' },
						{ value: offlineDevices.value, name: '离线' }
					]
				}
			]
		}

		chart.setOption(option)

		// 响应式调整
		const resizeHandler = () => chart.resize()
		window.addEventListener('resize', resizeHandler)

		// 保存清理函数
		onBeforeUnmount(() => {
			window.removeEventListener('resize', resizeHandler)
			chart.dispose()
		})
	} catch (e) {
		console.error('设备状态图表渲染失败:', e)
	}
}

// 渲染设备类型分布图
const renderDeviceTypeChart = () => {
	if (!deviceTypeChart.value) {
		return
	}

	try {
		// 按设备类型分组统计
		const typeMap = new Map<number, number>()
		devices.value.forEach(device => {
			const type = device.type || 0
			typeMap.set(type, (typeMap.get(type) || 0) + 1)
		})

		// 转换为图表数据
		const chartData = Array.from(typeMap.entries()).map(([type, count]) => ({
			value: count,
			name: getDeviceType(type)
		}))

		const chart = echarts.init(deviceTypeChart.value)
		const option = {
			title: {
				text: '设备类型分布',
				left: 'center'
			},
			tooltip: {
				trigger: 'item',
				formatter: '{a} <br/>{b}: {c} ({d}%)'
			},
			legend: {
				orient: 'vertical',
				right: 10,
				top: 'center',
				data: chartData.map(item => item.name)
			},
			series: [
				{
					name: '设备类型',
					type: 'pie',
					radius: ['40%', '70%'],
					center: ['40%', '50%'],
					avoidLabelOverlap: false,
					label: {
						show: true,
						formatter: '{b}: {c}'
					},
					emphasis: {
						label: {
							show: true,
							fontSize: 14,
							fontWeight: 'bold'
						}
					},
					data: chartData
				}
			]
		}

		chart.setOption(option)

		// 响应式调整
		const resizeHandler = () => chart.resize()
		window.addEventListener('resize', resizeHandler)

		// 保存清理函数
		onBeforeUnmount(() => {
			window.removeEventListener('resize', resizeHandler)
			chart.dispose()
		})
	} catch (e) {
		console.error('设备类型图表渲染失败:', e)
	}
}

// 渲染温度柱状图
const renderTempChart = () => {
	if (!tempChart.value) {
		return
	}

	try {
		// 获取当前页数据
		const startIndex = tempCurrentPage.value * tempPageSize.value
		const endIndex = startIndex + tempPageSize.value
		const currentPageData = [...devices.value].sort((a, b) => b.temperature - a.temperature).slice(startIndex, endIndex)

		const chart = echarts.init(tempChart.value)
		const option = {
			tooltip: {
				trigger: 'axis',
				axisPointer: {
					type: 'shadow'
				},
				formatter: function (params: any) {
					const data = params[0]
					const device = currentPageData[data.dataIndex]
					return `
            设备: ${device.name}<br/>
            温度: ${device.temperature}°C<br/>
            状态: ${getRunningStatus(device.runningStatus)}<br/>
            类型: ${getDeviceType(device.type)}
          `
				}
			},
			grid: {
				left: '3%',
				right: '4%',
				bottom: '10%',
				top: '10%',
				containLabel: true
			},
			xAxis: {
				type: 'category',
				data: currentPageData.map(d => d.name),
				axisLabel: {
					interval: 0,
					rotate: 30
				}
			},
			yAxis: {
				type: 'value',
				name: '温度 (°C)',
				axisLine: {
					show: true
				},
				splitLine: {
					show: true
				}
			},
			series: [
				{
					name: '设备温度',
					type: 'bar',
					data: currentPageData.map(d => ({
						value: d.temperature,
						itemStyle: {
							color: d.temperature > 40 ? '#F56C6C' : d.temperature > 35 ? '#E6A23C' : '#67C23A'
						}
					})),
					label: {
						show: true,
						position: 'top',
						formatter: '{c}°C'
					}
				}
			],
			dataZoom: [
				{
					type: 'inside',
					start: 0,
					end: 100
				}
			]
		}

		chart.setOption(option)

		// 响应式调整
		const resizeHandler = () => chart.resize()
		window.addEventListener('resize', resizeHandler)

		// 保存清理函数
		onBeforeUnmount(() => {
			window.removeEventListener('resize', resizeHandler)
			chart.dispose()
		})
	} catch (e) {
		console.error('温度图表渲染失败:', e)
	}
}

// 渲染所有设备图表
const renderDeviceCharts = () => {
	renderDeviceStatusChart()
	renderDeviceTypeChart()
	renderTempChart()
}

// 设备类型映射
const getDeviceType = (type: number): string => {
	const types: Record<number, string> = {
		1: '手持设备',
		2: '柜体',
		3: '传感设备'
	}
	return types[type] || `未知类型(${type})`
}

// 运行状态映射
const getRunningStatus = (status: number): string => {
	const statuses: Record<number, string> = {
		0: '离线',
		1: '运行中',
		2: '正常待机',
		3: '用户使用中',
		4: 'OTA升级中'
	}
	return statuses[status] || `未知状态(${status})`
}

// 初始化
onMounted(() => {
	// 初始化时间显示
	updateTime()
	const timeInterval = setInterval(updateTime, 1000)

	// 添加全屏事件监听
	document.addEventListener('fullscreenchange', handleFullscreenChange)
	document.addEventListener('webkitfullscreenchange', handleFullscreenChange)
	document.addEventListener('mozfullscreenchange', handleFullscreenChange)
	document.addEventListener('MSFullscreenChange', handleFullscreenChange)

	// 初始化数据
	fetchTenantData()
	fetchDeviceData()

	// 保存清理函数
	onBeforeUnmount(() => {
		clearInterval(timeInterval)

		// 移除事件监听
		document.removeEventListener('fullscreenchange', handleFullscreenChange)
		document.removeEventListener('webkitfullscreenchange', handleFullscreenChange)
		document.removeEventListener('mozfullscreenchange', handleFullscreenChange)
		document.removeEventListener('MSFullscreenChange', handleFullscreenChange)

		// 清理定时器
		if (tempInterval) {
			window.clearInterval(tempInterval)
		}
	})
})
</script>

<style scoped>
.dashboard-container {
	padding: 20px;
	background-color: #f5f7fa;
	min-height: 100vh;
}

.stats-row {
	margin-bottom: 20px;
}

.stat-card {
	text-align: center;
	border-radius: 8px;
	box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
	transition: all 0.3s;
}

.stat-card:hover {
	transform: translateY(-5px);
	box-shadow: 0 8px 25px rgba(0, 150, 255, 0.4);
}

.stat-title {
	font-size: 14px;
	color: #909399;
	margin-bottom: 10px;
}

.stat-value {
	font-size: 24px;
	font-weight: bold;
}

.stat-value.success {
	color: #67c23a;
}

.stat-value.warning {
	color: #e6a23c;
}

.charts-row {
	margin-bottom: 20px;
}

.tenant-table {
	margin-top: 20px;
}

/* 图表标题样式 */
.chart-title {
	font-size: 16px;
	font-weight: bold;
	margin-bottom: 15px;
	padding-left: 10px;
	border-left: 4px solid #409eff;
}

/* 分页指示器 */
.pagination-dots {
	display: flex;
	justify-content: center;
	margin-top: 15px;
	gap: 8px;
}

.dot {
	width: 12px;
	height: 12px;
	border-radius: 50%;
	background: #dcdfe6;
	cursor: pointer;
	transition: all 0.3s;
}

.dot.active {
	background: #409eff;
	transform: scale(1.2);
	box-shadow: 0 0 8px rgba(64, 158, 255, 0.5);
}

/* 高温警告文本 */
.warning-text {
	color: #f56c6c;
	font-weight: bold;
	animation: pulse 1.5s infinite;
}

@keyframes pulse {
	0% {
		opacity: 1;
	}
	50% {
		opacity: 0.7;
	}
	100% {
		opacity: 1;
	}
}

/* 顶部操作栏样式 */
.dashboard-header {
	display: flex;
	justify-content: space-between;
	align-items: center;
	margin-bottom: 25px;
	padding-bottom: 15px;
	border-bottom: 1px solid #eee;
}

.dashboard-header h1 {
	font-size: 24px;
	font-weight: bold;
	margin: 0;
}

.header-actions {
	display: flex;
	align-items: center;
	gap: 15px;
}

.current-time {
	font-size: 16px;
	color: #606266;
}

/* 全屏模式下的样式优化 */
:fullscreen .dashboard-container {
	padding: 30px;
	background: linear-gradient(135deg, #0f1c3c 0%, #1a3a6c 100%);
	color: #e0f0ff;
}

:fullscreen .stat-card,
:fullscreen .el-card {
	background: rgba(16, 31, 63, 0.7);
	border: 1px solid rgba(0, 195, 255, 0.3);
	color: #e0f0ff;
}

:fullscreen .stat-title {
	color: #8dc6ff;
}

:fullscreen .chart-title {
	color: #8dc6ff;
	border-left-color: #00c3ff;
}

:fullscreen .dashboard-header {
	border-bottom: 1px solid rgba(0, 195, 255, 0.3);
}

:fullscreen .dashboard-header h1 {
	font-size: 32px;
	text-shadow: 0 0 10px rgba(0, 195, 255, 0.7);
}

:fullscreen .current-time {
	color: #8dc6ff;
}

/* 按钮样式 */
:fullscreen .el-button {
	background: rgba(0, 195, 255, 0.2);
	border: 1px solid rgba(0, 195, 255, 0.5);
	color: #00c3ff;
}

/* 高温警告动画增强 */
:fullscreen .warning-text {
	animation: pulse-full 1.5s infinite;
}

@keyframes pulse-full {
	0% {
		opacity: 1;
		text-shadow: 0 0 5px rgba(245, 108, 108, 0.8);
	}
	50% {
		opacity: 0.7;
		text-shadow: 0 0 10px rgba(245, 108, 108, 1);
	}
	100% {
		opacity: 1;
		text-shadow: 0 0 5px rgba(245, 108, 108, 0.8);
	}
}
</style>
