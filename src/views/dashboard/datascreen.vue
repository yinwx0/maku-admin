<template>
	<div ref="screenRef" class="data-screen">
		<!-- 顶部导航栏 -->
		<div class="navbar">
			<div class="logo-area">
				<div class="logo">U</div>
				<div class="system-title">校园设备监控平台</div>
			</div>
			<div class="nav-buttons">
				<div class="nav-button" @click="goToDashboard">
					<el-icon><Monitor /></el-icon>
					<span>设备总览</span>
				</div>
				<div class="nav-button" @click="goToDevices">
					<el-icon><Cpu /></el-icon>
					<span>设备管理</span>
				</div>
				<div class="nav-button" @click="goToWarning">
					<el-icon><WarningFilled /></el-icon>
					<span>告警中心</span>
				</div>
				<div class="nav-button" @click="goToAnalysis">
					<el-icon><TrendCharts /></el-icon>
					<span>统计分析</span>
				</div>
				<div class="nav-button" @click="goToSettings">
					<el-icon><Setting /></el-icon>
					<span>系统设置</span>
				</div>
			</div>
		</div>

		<div class="screen-content">
			<div class="screen-action">
				<el-icon class="icon pulse" @click="refreshData"><Refresh /></el-icon>
				<el-icon class="icon" @click="handleFullScreen"><FullScreen /></el-icon>
			</div>

			<div class="header">
				<h1>校园设备监控数据大屏</h1>
				<div class="stats-bar">
					<div class="stat-item">
						<div class="stat-label">总设备数量</div>
						<div class="stat-value">
							<el-icon><Monitor /></el-icon> {{ deviceTotal }}
						</div>
					</div>
					<div class="stat-item">
						<div class="stat-label">今日告警次数</div>
						<div class="stat-value warning">
							<el-icon class="blink"><WarningFilled /></el-icon> {{ warningsToday }}
						</div>
					</div>
					<div class="stat-item">
						<div class="stat-label">用户在线率</div>
						<div class="stat-value">
							<el-icon><User /></el-icon> {{ onlineRate }}%
						</div>
					</div>
					<div class="stat-item">
						<div class="stat-label">设备正常率</div>
						<div class="stat-value">
							<el-icon><SuccessFilled /></el-icon> {{ normalRate }}%
						</div>
					</div>
					<div class="stat-item">
						<div class="time">{{ currentTime }}</div>
					</div>
				</div>
			</div>

			<div class="content">
				<div class="data-cards-row">
					<div class="data-card">
						<div class="card-header">
							<el-icon><WarningFilled /></el-icon>
							<span>实时告警统计</span>
							<div class="status">监控中</div>
						</div>
						<div ref="warningChart" class="chart"></div>
					</div>

					<div class="data-card">
						<div class="card-header">
							<el-icon><Cpu /></el-icon>
							<span>设备分类统计</span>
							<div class="status">5类设备</div>
						</div>
						<div ref="deviceChart" class="chart"></div>
					</div>

					<div class="data-card">
						<div class="card-header">
							<el-icon><UserFilled /></el-icon>
							<span>用户设备绑定</span>
							<div class="status">在线 {{ onlineUsers }} / {{ totalUsers }}</div>
						</div>
						<div ref="userChart" class="chart"></div>
					</div>
				</div>

				<div class="data-cards-row">
					<!-- 新增的小程序用户统计模块 -->
					<div class="data-card">
						<div class="card-header">
							<el-icon><User /></el-icon>
							<span>小程序注册用户总数</span>
							<div class="status">今日 +{{ dailyNewUsers }}</div>
						</div>
						<div class="user-stats-container">
							<div class="user-stat">
								<div class="user-stat-value">{{ totalUsers }}</div>
								<div class="user-stat-label">注册用户总数</div>
							</div>
							<div class="user-stat">
								<div class="user-stat-value">{{ monthlyActiveUsers }}</div>
								<div class="user-stat-label">月活跃用户</div>
							</div>
							<div class="user-stat">
								<div class="user-stat-value">{{ dailyActiveUsers }}</div>
								<div class="user-stat-label">日活跃用户</div>
							</div>
						</div>
						<div ref="userGrowthChart" class="chart"></div>
					</div>

					<!-- 新增的新用户统计模块 -->
					<div class="data-card">
						<div class="card-header">
							<el-icon><TrendCharts /></el-icon>
							<span>新增用户统计</span>
							<div class="status">最近7天</div>
						</div>
						<div class="new-user-stats">
							<div class="new-user-stat">
								<div class="new-user-value">{{ dailyNewUsers }}</div>
								<div class="new-user-label">今日新增</div>
							</div>
							<div class="new-user-stat">
								<div class="new-user-value">{{ weeklyNewUsers }}</div>
								<div class="new-user-label">本周新增</div>
							</div>
							<div class="new-user-stat">
								<div class="new-user-value">{{ monthlyNewUsers }}</div>
								<div class="new-user-label">本月新增</div>
							</div>
						</div>
						<div ref="newUserChart" class="chart"></div>
					</div>

					<!-- 保留设备状态分布 -->
					<div class="data-card">
						<div class="card-header">
							<el-icon><Operation /></el-icon>
							<span>设备状态分布</span>
							<div class="status">3种状态</div>
						</div>
						<div ref="statusChart" class="chart"></div>
					</div>
				</div>

				<div class="stats-footer">
					<div class="stats-box">
						<div class="stats-label">绑定设备总数</div>
						<div class="stats-large">4,820</div>
						<div class="stats-trend up">
							<el-icon><Top /></el-icon> +32 今日新增
						</div>
					</div>

					<div class="stats-box">
						<div class="stats-label">故障设备总数</div>
						<div class="stats-large">38</div>
						<div class="stats-trend down">
							<el-icon><Bottom /></el-icon> -8 今日解决
						</div>
					</div>

					<div class="stats-box">
						<div class="stats-label">设备维护中</div>
						<div class="stats-large">125</div>
						<div class="stats-trend up">
							<el-icon><Top /></el-icon> +20 今日新增
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import * as echarts from 'echarts'
import {
	Monitor,
	Cpu,
	WarningFilled,
	TrendCharts,
	Setting,
	Refresh,
	FullScreen,
	User,
	SuccessFilled,
	Top,
	Bottom,
	Operation,
	UserFilled
} from '@element-plus/icons-vue'

const currentTime = ref('')
const deviceTotal = ref(2860)
const warningsToday = ref(12)
const onlineRate = ref(96)
const normalRate = ref(98.7)
const onlineUsers = ref(1120)
const totalUsers = ref(1250)
const dailyNewUsers = ref(42)
const weeklyNewUsers = ref(285)
const monthlyNewUsers = ref(1250)
const monthlyActiveUsers = ref(850)
const dailyActiveUsers = ref(350)

const screenRef = ref<HTMLElement | null>(null)
const warningChart = ref<HTMLElement | null>(null)
const deviceChart = ref<HTMLElement | null>(null)
const userChart = ref<HTMLElement | null>(null)
const statusChart = ref<HTMLElement | null>(null)
const newUserChart = ref<HTMLElement | null>(null)
const userGrowthChart = ref<HTMLElement | null>(null)

// 更新时间
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

// 刷新数据
const refreshData = () => {
	deviceTotal.value = 2860 + Math.floor(Math.random() * 40)
	warningsToday.value = 12 + Math.floor(Math.random() * 5)
	onlineUsers.value = 1120 + Math.floor(Math.random() * 30)
	onlineRate.value = Math.round((onlineUsers.value / totalUsers.value) * 100)
	dailyNewUsers.value = 42 + Math.floor(Math.random() * 15)
	weeklyNewUsers.value = 285 + Math.floor(Math.random() * 40)
	monthlyNewUsers.value = 1250 + Math.floor(Math.random() * 100)
	monthlyActiveUsers.value = 850 + Math.floor(Math.random() * 50)
	dailyActiveUsers.value = 350 + Math.floor(Math.random() * 30)

	// 重新初始化图表
	initWarningChart()
	initDeviceChart()
	initUserChart()
	initStatusChart()
	initNewUserChart()
	initUserGrowthChart()
}

// 全屏显示
const handleFullScreen = () => {
	const element = screenRef.value
	if (!element) {
		return
	}

	if (document.fullscreenElement) {
		document.exitFullscreen()
	} else {
		element.requestFullscreen().catch(err => {
			console.error(`全屏请求失败: ${err}`)
		})
	}
}

// 初始化告警统计图表
const initWarningChart = () => {
	if (!warningChart.value) {
		return
	}
	const chart = echarts.init(warningChart.value)
	const option = {
		tooltip: {
			trigger: 'axis',
			backgroundColor: 'rgba(0,0,0,0.8)',
			borderColor: '#F56C6C',
			textStyle: { color: '#fff' },
			formatter: function (params: any) {
				return `${params[0].axisValue}<br/>
        <span style="color:#F56C6C">●</span> 告警次数: ${params[0].data}次`
			}
		},
		grid: {
			top: '10%',
			left: '3%',
			right: '4%',
			bottom: '15%',
			containLabel: true
		},
		xAxis: {
			type: 'category',
			data: ['监控', '门禁', '传感器', '服务器', '网络', '终端', '其他'],
			axisLine: { lineStyle: { color: 'rgba(255,255,255,0.5)', width: 1 } },
			axisLabel: {
				color: '#aaa',
				fontSize: 12,
				interval: 0
			},
			splitLine: { show: false }
		},
		yAxis: {
			type: 'value',
			name: '告警次数',
			nameTextStyle: { color: '#aaa', fontSize: 12 },
			minInterval: 1,
			axisLine: { show: false },
			axisLabel: {
				color: '#aaa',
				fontSize: 12,
				margin: 2
			},
			splitLine: {
				lineStyle: {
					color: 'rgba(255,255,255,0.1)',
					type: 'dashed'
				}
			}
		},
		series: [
			{
				name: '告警次数',
				type: 'bar',
				barWidth: '25%',
				data: [
					5 + Math.floor(Math.random() * 5),
					12 + Math.floor(Math.random() * 3),
					8 + Math.floor(Math.random() * 4),
					3 + Math.floor(Math.random() * 3),
					6 + Math.floor(Math.random() * 4),
					4 + Math.floor(Math.random() * 3),
					2 + Math.floor(Math.random() * 2)
				],
				itemStyle: {
					color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
						{ offset: 0, color: '#F56C6C' },
						{ offset: 1, color: '#F56C6C88' }
					]),
					borderRadius: [6, 6, 0, 0]
				},
				label: {
					show: true,
					position: 'top',
					color: '#F56C6C',
					fontWeight: 'bold',
					fontSize: 13,
					formatter: '{c}次'
				},
				animation: true,
				animationDuration: 1500,
				animationEasing: 'cubicOut'
			}
		]
	}
	chart.setOption(option)
}

// 初始化设备分类图表
const initDeviceChart = () => {
	if (!deviceChart.value) {
		return
	}
	const chart = echarts.init(deviceChart.value)
	const option = {
		tooltip: {
			trigger: 'item',
			backgroundColor: 'rgba(0,0,0,0.8)',
			borderColor: '#409EFF',
			textStyle: { color: '#fff' },
			formatter: '{b}: {c} ({d}%)'
		},
		legend: {
			bottom: 0,
			left: 'center',
			textStyle: { color: '#aaa', fontSize: 12 },
			itemHeight: 14,
			itemGap: 20
		},
		series: [
			{
				name: '设备分类',
				type: 'pie',
				radius: ['45%', '70%'],
				center: ['50%', '40%'],
				avoidLabelOverlap: false,
				itemStyle: {
					borderRadius: 10,
					borderColor: '#0c1633',
					borderWidth: 2
				},
				label: {
					show: true,
					color: '#fff',
					fontSize: 13,
					fontWeight: 'bold',
					formatter: function (params: any) {
						return `${params.name}\n${params.percent}%`
					}
				},
				emphasis: {
					label: {
						show: true,
						fontSize: 14,
						fontWeight: 'bold'
					},
					itemStyle: {
						shadowBlur: 10,
						shadowOffsetX: 0,
						shadowColor: 'rgba(0, 0, 0, 0.5)'
					}
				},
				labelLine: {
					show: true,
					length: 8,
					length2: 15
				},
				data: [
					{ value: 1120, name: '门禁设备', itemStyle: { color: '#409EFF' } },
					{ value: 850, name: '监控设备', itemStyle: { color: '#67C23A' } },
					{ value: 420, name: '传感器', itemStyle: { color: '#E6A23C' } },
					{ value: 270, name: '服务终端', itemStyle: { color: '#909399' } },
					{ value极: 200, name: '网络设备', itemStyle: { color: '#F56C6C' } }
				],
				animation: true,
				animationDuration: 1500,
				animationEasing: 'cubicOut'
			}
		]
	}
	chart.setOption(option)
}

// 初始化用户绑定图表
const initUserChart = () => {
	if (!userChart.value) {
		return
	}
	const chart = echarts.init(userChart.value)
	const option = {
		tooltip: {
			trigger: 'item',
			backgroundColor: 'rgba(0,0,0,0.极8)',
			borderColor: '#67C23A',
			textStyle: { color: '#fff' },
			formatter: function (params: any) {
				return `${params.seriesName}: ${params.value}人<br/>${params.name}`
			}
		},
		legend: {
			bottom: 0,
			left: 'center',
			textStyle: { color: '#aaa', fontSize: 12 },
			itemHeight: 14,
			itemGap: 20
		},
		series: [
			{
				name: '男',
				type: 'pie',
				radius: ['35%', '60%'],
				center: ['30%', '50%'],
				avoidLabelOverlap: false,
				itemStyle: {
					borderRadius: 10,
					borderColor: '#0c1633',
					borderWidth: 2
				},
				emphasis: {
					label: {
						show: true,
						fontSize: 14,
						fontWeight: 'bold'
					}
				},
				labelLine: {
					length: 3,
					length2: 8
				},
				data: [
					{ value: 240, name: '未绑定' },
					{ value: 350, name: '绑定1台' },
					{ value: 280, name: '绑定2台' },
					{ value: 150, name: '绑定3台+' }
				],
				color: ['#64B5F6', '#42A5F5', '#1E88E5', '#0D47A1'],
				label: {
					show: false
				},
				animation: true
			},
			{
				name: '女',
				type: 'pie',
				radius: ['35%', '60%'],
				center: ['70%', '50%'],
				avoidLabelOverlap: false,
				itemStyle: {
					borderRadius: 10,
					borderColor: '#0c1633',
					borderWidth: 2
				},
				emphasis: {
					label: {
						show: true,
						fontSize: 14,
						fontWeight: 'bold'
					}
				},
				labelLine: {
					length: 3,
					length2: 8
				},
				data: [
					{ value: 210, name: '未绑定' },
					{ value: 380, name: '绑定1台' },
					{ value: 320, name: '绑定2台' },
					{ value: 170, name: '绑定3台+' }
				],
				color: ['#F06292', '#EC407A', '#D81B60', '#880E4F'],
				label: {
					show: false
				},
				animation: true
			}
		]
	}
	chart.setOption(option)
}

// 初始化用户增长图表（新增加的功能）
const initUserGrowthChart = () => {
	if (!userGrowthChart.value) {
		return
	}
	const chart = echarts.init(userGrowthChart.value)
	const option = {
		tooltip: {
			trigger: 'axis',
			backgroundColor: 'rgba(0,0,0,0.8)',
			borderColor: '#67C23A',
			textStyle: { color: '#fff' }
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
			data: ['一月', '二月', '三月', '四月', '五月', '六月', '七月'],
			axisLine: { lineStyle: { color: 'rgba(255,255,255,0.5)', width: 1 } },
			axisLabel: {
				color: '#aaa',
				fontSize: 12,
				interval: 0
			},
			splitLine: { show: false }
		},
		yAxis: {
			type: 'value',
			name: '用户数量',
			nameTextStyle: { color: '#aaa', fontSize: 12 },
			axisLine: { show: false },
			axisLabel: {
				color: '#aaa',
				fontSize: 12,
				margin: 2
			},
			splitLine: {
				lineStyle: {
					color: 'rgba(255,255,255,0.1)',
					type: 'dashed'
				}
			}
		},
		series: [
			{
				name: '用户总数',
				type: 'line',
				smooth: true,
				data: [850, 920, 950, 1050, 1120, 1200, 1250],
				itemStyle: {
					color: '#409EFF'
				},
				lineStyle: {
					width: 3
				},
				symbolSize: 8,
				symbol: 'circle',
				areaStyle: {
					color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
						{ offset: 0, color: 'rgba(64, 158, 255, 0.5)' },
						{ offset: 1, color: 'rgba(64, 158, 255, 0.1)' }
					])
				},
				label: {
					show: true,
					position: 'top',
					color: '#409EFF',
					fontSize: 12
				}
			}
		]
	}
	chart.setOption(option)
}

// 初始化新增用户图表（新增加的功能）
const initNewUserChart = () => {
	if (!newUserChart.value) {
		return
	}
	const chart = echarts.init(newUserChart.value)
	const option = {
		tooltip: {
			trigger: 'axis',
			backgroundColor: 'rgba(0,0,0,0.8)',
			borderColor: '#E6A23C',
			textStyle: { color: '#fff' }
		},
		grid: {
			left: '3%',
			right: '4%',
			bottom: '15%',
			top: '10%',
			containLabel: true
		},
		xAxis: {
			type: 'category',
			data: ['周一', '周二', '周三', '周四', '周五', '周六', '周日'],
			axisLine: { lineStyle: { color: 'rgba(255,255,255,0.5)', width: 1 } },
			axisLabel: {
				color: '#aaa',
				fontSize: 12
			},
			splitLine: { show: false }
		},
		yAxis: {
			type: 'value',
			name: '新增用户',
			nameTextStyle: { color: '#aaa', fontSize: 12 },
			minInterval: 1,
			axisLine: { show: false },
			axisLabel: {
				color: '#aaa',
				fontSize: 12
			},
			splitLine: {
				lineStyle: {
					color: 'rgba(255,255,255,0.1)',
					type: 'dashed'
				}
			}
		},
		series: [
			{
				name: '新增用户',
				type: 'bar',
				data: [65, 38, 42, 55, 47, 32, 52],
				itemStyle: {
					color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
						{ offset: 0, color: '#E6A23C' },
						{ offset: 1, color: '#E6A23C88' }
					]),
					borderRadius: [6, 6, 0, 0]
				},
				label: {
					show: true,
					position: 'top',
					color: '#E6A23C',
					fontWeight: 'bold',
					fontSize: 12
				}
			}
		]
	}
	chart.setOption(option)
}

// 初始化设备状态图表
const initStatusChart = () => {
	if (!statusChart.value) {
		return
	}
	const chart = echarts.init(statusChart.value)
	const option = {
		tooltip: {
			trigger: 'axis',
			axisPointer: {
				type: 'shadow'
			},
			backgroundColor: 'rgba(0,0,0,0.8)',
			borderColor: '#E6A23C',
			textStyle: { color: '#fff' }
		},
		legend: {
			bottom: 0,
			left: 'center',
			textStyle: { color: '#aaa', fontSize: 12 },
			itemHeight: 14,
			itemGap: 20
		},
		grid: {
			left: '3%',
			right: '4%',
			bottom: '15%',
			top: '5%',
			containLabel: true
		},
		xAxis: {
			type: 'category',
			data: ['门禁设备', '监控设备', '传感器', '服务终端', '网络设备'],
			axisLine: { lineStyle: { color: 'rgba(255,255,255,0.5)', width: 1 } },
			axisLabel: {
				color: '#aaa',
				fontSize: 12,
				rotate: 30
			},
			splitLine: { show: false }
		},
		yAxis: {
			type: 'value',
			name: '设备数量',
			nameTextStyle: { color: '#aaa', fontSize: 12 },
			axisLine: { show: false },
			axisLabel: {
				color: '#aaa',
				fontSize: 12
			},
			splitLine: {
				lineStyle: {
					color: 'rgba(255,255,255,0.1)',
					type: 'dashed'
				}
			}
		},
		series: [
			{
				name: '在线',
				type: 'bar',
				stack: 'total',
				data: [1020, 780, 380, 240, 180],
				itemStyle: {
					color: '#67C23A'
				}
			},
			{
				name: '离线',
				type: 'bar',
				stack: 'total',
				data: [80, 50, 30, 20, 15],
				itemStyle: {
					color: '#909399'
				}
			},
			{
				name: '故障',
				type: 'bar',
				stack: 'total',
				data: [20, 20, 10, 10, 5],
				itemStyle: {
					color: '#F56C6C'
				}
			}
		]
	}
	chart.setOption(option)
}

// 定时器
let timer: any

onMounted(() => {
	updateTime()
	timer = setInterval(updateTime, 1000)

	// 初始化图表
	setTimeout(() => {
		initWarningChart()
		initDeviceChart()
		initUserChart()
		initStatusChart()
		initNewUserChart()
		initUserGrowthChart()
	}, 100)

	window.addEventListener('resize', () => {
		const charts = [warningChart, deviceChart, userChart, statusChart, newUserChart, userGrowthChart]
		charts.forEach(chart => {
			if (chart.value) {
				const instance = echarts.getInstanceByDom(chart.value)
				if (instance) {
					instance.resize()
				}
			}
		})
	})
})

onUnmounted(() => {
	clearInterval(timer)
	const charts = [warningChart, deviceChart, userChart, statusChart, newUserChart, userGrowthChart]
	charts.forEach(chart => {
		if (chart.value) {
			const instance = echarts.getInstanceByDom(chart.value)
			if (instance) {
				instance.dispose()
			}
		}
	})
})

const goToDashboard = () => console.log('切换到设备总览')
const goToDevices = () => console.log('切换到设备管理')
const goToWarning = () => console.log('切换到告警中心')
const goToAnalysis = () => console.log('切换到统计分析')
const goToSettings = () => console.log('切换到系统设置')
</script>

<style scoped>
* {
	margin: 0;
	padding: 0;
	box-sizing: border-box;
	font-family: 'Microsoft YaHei', 'PingFang SC', sans-serif;
}

body {
	overflow: hidden;
	background: linear-gradient(135deg, #0d1a30 0%, #152640 100%);
	color: white;
	height: 100vh;
	line-height: 1.6;
}

.data-screen {
	height: 100%;
	position: relative;
	overflow: auto;
	padding: 20px;
	display: flex;
	flex-direction: column;
}

/* 顶部导航栏 */
.navbar {
	background: rgba(13, 极6, 48, 0.95);
	padding: 0 20px;
	height: 60px;
	display: flex;
	align-items: center;
	justify-content: space-between;
	box-shadow: 0 2px 15px rgba(0, 0, 0, 0.3);
	position: relative;
	z-index: 100;
	border-bottom: 1px solid rgba(64, 158, 255, 0.2);
}

.logo-area {
	display: flex;
	align-items: center;
}

.logo {
	width: 40px;
	height: 40px;
	background: linear-gradient(135deg, #409eff, #67c23a);
	border-radius: 50%;
	display: flex;
	align-items: center;
	justify-content: center;
	font-size: 20px;
	font-weight: bold;
	margin-right: 15px;
}

.system-title {
	font-size: 20px;
	background: linear-gradient(90deg, #fff, #409eff);
	-webkit-background-clip: text;
	-webkit-text-fill-color: transparent;
	font-weight: bold;
}

.nav-buttons {
	display: flex;
	gap: 15px;
}

.nav-button {
	padding: 8px 20px;
	background: rgba(64, 158, 255, 0.15);
	border: 1px solid rgba(64, 158, 255, 0.4);
	border-radius: 5px;
	color: #409eff;
	cursor: pointer;
	transition: all 0.3s ease;
	display: flex;
	align-items: center;
	gap: 8px;
}

.nav-button:hover {
	background: rgba(64, 158, 255, 0.3);
	transform: translateY(-2px);
	box-shadow: 0 5px 10px rgba(64, 158, 255, 0.15);
}

.screen-action {
	position: absolute;
	top: 20px;
	right: 20px;
	z-index: 10;
	display: flex;
	gap: 10px;
}

.screen-action .icon {
	font-size: 24px;
	cursor: pointer;
	color: #409eff;
	transition: all 0.3s;
	padding: 8px;
	background: rgba(64, 158, 255, 0.1);
	border-radius: 50%;
	border: 1px solid rgba(64, 158, 255, 0.5);
	display: flex;
	align-items: center;
	justify-content: center;
}

.screen-action .icon:hover {
	transform: scale(1.2);
	background: rgba(64, 158, 255, 0.3);
}

.screen-content {
	flex: 1;
	display: flex;
	flex-direction: column;
	position: relative;
}

.header {
	display: flex;
	justify-content: space-between;
	align-items: center;
	margin: 20px 0;
	padding: 0 20px;
	background: rgba(255, 255, 255, 0.05);
	border-radius: 8px;
	height: 80px;
	box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
}

.header h1 {
	font-size: 32px;
	margin: 0;
	background: linear-gradient(90deg, #fff, #409eff);
	-webkit-background-clip: text;
	-webkit-text-fill-color: transparent;
	font-weight: bold;
	letter-spacing: 1px;
}

.stats-bar {
	display: flex;
	gap: 30px;
}

.stat-item {
	display: flex;
	flex-direction: column;
	align-items: center;
	min-width: 140px;
}

.stat-label {
	font-size: 14px;
	color: #aaa;
	margin-bottom: 5px;
	white-space: nowrap;
}

.stat-value {
	font-size: 24px;
	font-weight: bold;
	display: flex;
	align-items: center;
	gap: 5px;
}

.stat-value .el-icon {
	font-size: 20px;
}

.stat-value.warning {
	color: #e6a23c;
}

.stat-value.error {
	color: #f56c6c;
}

.time {
	font-size: 20px;
	padding: 8px 15px;
	background: rgba(64, 158, 255, 0.1);
	border-radius: 4px;
	color: #409eff;
	white-space: nowrap;
}

.content {
	flex: 1;
	padding-bottom: 30px;
	display: flex;
	flex-direction: column;
}

.data-cards-row {
	display: flex;
	gap: 20px;
	margin-bottom: 20px;
}

.data-card {
	background: rgba(255, 255, 255, 0.05);
	border-radius: 12px;
	padding: 20px;
	flex: 1;
	box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
	transition:
		transform 0.3s ease,
		box-shadow 0.3s ease;
	border: 1px solid rgba(255, 255, 255, 0.1);
	display: flex;
	flex-direction: column;
}

.data-card:hover {
	transform: translateY(-5px);
	box-shadow: 0 8px 25px rgba(0, 0, 0, 0.2);
}

.card-header {
	display: flex;
	align-items: center;
	margin-bottom: 20px;
	padding-bottom: 15px;
	border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.card-header .el-icon {
	margin-right: 12px;
	font-size: 24px;
	color: #409eff;
}

.card-header span {
	font-size: 18px;
	font-weight: 500;
	flex: 1;
}

.card-header .status {
	font-size: 14px;
	padding: 4px 10px;
	border-radius: 20px;
	background: rgba(64, 158, 255, 0.2);
	color: #409eff;
	white-space: nowrap;
}

.chart {
	height: 200px;
	transition: opacity 0.3s ease;
}

/* 新增的用户统计样式 */
.user-stats-container {
	display: flex;
	justify-content: space-between;
	margin: 15px 0;
}

.user-stat {
	display: flex;
	flex-direction: column;
	align-items: center;
	flex: 1;
}

.user-stat-value {
	font-size: 24px;
	font-weight: bold;
	margin-bottom: 5px;
	color: #67c23a;
}

.user-stat-label {
	font-size: 12px;
	color: #aaa;
}

.new-user-stats {
	display: flex;
	justify-content: space-between;
	margin: 15px 0;
}

.new-user-stat {
	display: flex;
	flex-direction: column;
	align-items: center;
	flex: 1;
}

.new-user-value {
	font-size: 24px;
	font-weight: bold;
	margin-bottom: 5px;
	color: #e6a23c;
}

.new-user-label {
	font-size: 12px;
	color: #aaa;
}

.stats-footer {
	display: flex;
	gap: 20px;
	padding-top: 20px;
}

.stats-box {
	flex: 1;
	background: rgba(255, 255, 255, 0.05);
	border-radius: 8px;
	padding: 15px;
	display: flex;
	flex-direction: column;
	align-items: center;
	box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
	transition: all 0.3s;
}

.stats-box:hover {
	transform: translateY(-3px);
	box-shadow: 0 6px 15px rgba(0, 0, 0, 0.2);
}

.stats-label {
	font-size: 14px;
	color: #aaa;
	margin-bottom: 10px;
}

.stats-large {
	font-size: 32px;
	font-weight: bold;
	margin-bottom: 5px;
	background: linear-gradient(90deg, #409eff, #67c23a);
	-webkit-background-clip: text;
	-webkit-text-fill-color: transparent;
}

.stats-trend {
	font-size: 14px;
	display: flex;
	align-items: center;
	gap: 4px;
}

.stats-trend .el-icon {
	font-size: 16px;
}

.stats-trend.up {
	color: #67c23a;
}

.stats-trend.down {
	color: #f56c6c;
}

/* 动效增强 */
@keyframes pulse {
	0% {
		box-shadow: 0 0 0 0 rgba(64, 158, 255, 0.4);
	}
	70% {
		box-shadow: 0 0 0 10px rgba(64, 158, 255, 0);
	}
	100% {
		box-shadow: 0 0 0 0 rgba(64, 158, 255, 0);
	}
}

@keyframes blink {
	0% {
		opacity: 1;
	}
	50% {
		opacity: 0.3;
	}
	100% {
		opacity: 1;
	}
}

.pulse {
	animation: pulse 2s infinite;
}

.blink {
	animation: blink 1.5s infinite;
}
</style>
