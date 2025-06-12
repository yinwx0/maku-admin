import { createApp } from 'vue'
import ElementPlus from 'element-plus'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import App from './App.vue'
import { createPinia } from 'pinia'
import { directive } from './utils/directive'
import { router } from './router'
import { i18n } from './i18n'
import axios from 'axios'
import 'virtual:svg-icons-register'

import '@/icons/iconfont/iconfont'
import 'element-plus/dist/index.css'
import '@/styles/index.scss'

import 'xe-utils'
import VXETable from 'vxe-table'
import 'vxe-table/lib/style.css'

import MaComponent from '@/components/index'
// 1. 引入 vue-echarts 组件和 echarts 模块
import VChart from 'vue-echarts'
import { use } from 'echarts/core'
import { CanvasRenderer } from 'echarts/renderers'
import { BarChart, PieChart } from 'echarts/charts'
import { TitleComponent, TooltipComponent, LegendComponent, GridComponent } from 'echarts/components'

// 2. 注册 ECharts 需要的模块
use([CanvasRenderer, BarChart, PieChart, TitleComponent, TooltipComponent, LegendComponent, GridComponent])

// 3. 在 app 上注册组件

VXETable.config({
	zIndex: 3000,
	select: {
		transfer: true
	}
})

const axiosInstance = axios.create({
	baseURL: '/', // 根据你实际情况设置
	timeout: 10000
	// ...其他配置
})

// 将 axios 挂载到全局属性上

const app = createApp(App)
app.use(createPinia())
app.component('VChart', VChart)
app.config.globalProperties.$axios = axiosInstance
// element plus图标 全局注册
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
	app.component(key, component)
}

// 注册 自定义指令
directive(app)
app.use(i18n)
app.use(router)
app.use(MaComponent)
app.use(ElementPlus)
app.use(VXETable)
app.mount('#app')
