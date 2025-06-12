<template>
	<div class="dashboard-container">
		<!-- 顶部统计卡片 -->
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
					<div class="stat-title">联系人总数</div>
					<div class="stat-value">{{ contactPersons }}</div>
				</el-card>
			</el-col>
		</el-row>

		<!-- 图表区域 -->
		<el-row :gutter="20" class="charts-row">
			<el-col :span="12">
				<el-card>
					<div ref="statusChart" style="height: 400px"></div>
				</el-card>
			</el-col>
			<el-col :span="12">
				<el-card>
					<div ref="contactChart" style="height: 400px"></div>
				</el-card>
			</el-col>
		</el-row>

		<!-- 租户列表 -->
		<el-card class="tenant-table">
			<el-table :data="state.dataList" height="400" style="width: 100%" :row-class-name="tableRowClassName">
				<el-table-column prop="tenantName" label="租户名称" width="180" />
				<el-table-column prop="contactPerson" label="联系人" width="120" />
				<el-table-column prop="contactPhone" label="联系电话" width="150" />
				<el-table-column prop="status" label="状态" width="100">
					<template #default="scope">
						<el-tag :type="scope.row.status === 1 ? 'success' : 'warning'">
							{{ scope.row.status === 1 ? '已激活' : '未激活' }}
						</el-tag>
					</template>
				</el-table-column>
				<el-table-column prop="createTime" label="创建时间" />
			</el-table>
		</el-card>
	</div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import * as echarts from 'echarts'
import service from '@/utils/request'

// 图表DOM引用
const statusChart = ref<HTMLElement>()
const contactChart = ref<HTMLElement>()

// 数据状态
const state = reactive({
	dataList: [] as any[],
	loading: false
})

// 统计指标
const totalTenants = ref(0)
const activatedCount = ref(0)
const inactivatedCount = ref(0)
const contactPersons = ref(0)

// 获取租户数据
const fetchTenantData = async () => {
	try {
		state.loading = true
		const res = await service.get('/new/business/tenant/page', {
			params: {
				page: 1,
				limit: 100 // 获取全部100条数据
			}
		})

		if (res.data?.list) {
			state.dataList = res.data.list
			calculateStats(res.data.list)
			renderCharts(res.data.list)
		}
	} catch (error) {
		console.error('获取租户数据失败:', error)
	} finally {
		state.loading = false
	}
}

// 计算统计数据
const calculateStats = (data: any[]) => {
	totalTenants.value = data.length
	activatedCount.value = data.filter(item => item.status === 1).length
	inactivatedCount.value = data.filter(item => item.status === 0).length
	contactPersons.value = data.filter(item => item.contactPerson).length
}

// 表格行样式
const tableRowClassName = ({ row }: { row: any }) => {
	return row.status === 1 ? 'success-row' : 'warning-row'
}

// 渲染状态分布图
const renderStatusChart = () => {
	if (!statusChart.value) {
		return
	}

	const chart = echarts.init(statusChart.value)
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
			data: ['已激活', '未激活']
		},
		series: [
			{
				name: '租户状态',
				type: 'pie',
				radius: ['40%', '70%'],
				center: ['40%', '50%'],
				avoidLabelOverlap: false,
				itemStyle: {
					borderRadius: 10,
					borderColor: '#fff',
					borderWidth: 2
				},
				label: {
					show: true,
					formatter: '{b}: {c} ({d}%)'
				},
				emphasis: {
					label: {
						show: true,
						fontSize: '18',
						fontWeight: 'bold'
					}
				},
				data: [
					{ value: activatedCount.value, name: '已激活', itemStyle: { color: '#67C23A' } },
					{ value: inactivatedCount.value, name: '未激活', itemStyle: { color: '#E6A23C' } }
				]
			}
		]
	}

	chart.setOption(option)

	// 响应式调整
	window.addEventListener('resize', () => {
		chart.resize()
	})
}

// 渲染联系人分布图
const renderContactChart = (data: any[]) => {
	if (!contactChart.value) {
		return
	}

	// 按联系人分组统计
	const contactMap = new Map()
	data.forEach(tenant => {
		const contact = tenant.contactPerson || '未知'
		contactMap.set(contact, (contactMap.get(contact) || 0) + 1)
	})

	const chart = echarts.init(contactChart.value)
	const option = {
		title: {
			text: '联系人分布',
			left: 'center'
		},
		tooltip: {
			trigger: 'axis',
			axisPointer: {
				type: 'shadow'
			}
		},
		grid: {
			left: '3%',
			right: '4%',
			bottom: '3%',
			containLabel: true
		},
		xAxis: {
			type: 'category',
			data: Array.from(contactMap.keys())
		},
		yAxis: {
			type: 'value',
			name: '租户数量'
		},
		series: [
			{
				name: '租户数量',
				type: 'bar',
				data: Array.from(contactMap.values()),
				itemStyle: {
					color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
						{ offset: 0, color: '#83bff6' },
						{ offset: 0.5, color: '#188df0' },
						{ offset: 1, color: '#188df0' }
					])
				}
			}
		]
	}

	chart.setOption(option)

	// 响应式调整
	window.addEventListener('resize', () => {
		chart.resize()
	})
}

// 渲染所有图表
const renderCharts = (data: any[]) => {
	renderStatusChart()
	renderContactChart(data)
}

// 初始化
onMounted(() => {
	fetchTenantData()
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

/* 表格行样式 */
:deep(.el-table .success-row) {
	--el-table-tr-bg-color: var(--el-color-success-light-9);
}

:deep(.el-table .warning-row) {
	--el-table-tr-bg-color: var(--el-color-warning-light-9);
}
</style>
