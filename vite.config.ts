import { resolve } from 'path'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

import { createSvgIconsPlugin } from 'vite-plugin-svg-icons'
import vueSetupExtend from 'vite-plugin-vue-setup-extend'

export default defineConfig({
	base: '/',
	resolve: {
		// 配置别名
		alias: {
			'@': resolve(__dirname, './src'),
			'vue-i18n': 'vue-i18n/dist/vue-i18n.cjs.js'
		}
	},
	plugins: [
		vue(),
		vueSetupExtend(),
		createSvgIconsPlugin({
			iconDirs: [resolve(__dirname, 'src/icons/svg')],
			symbolId: 'icon-[dir]-[name]'
		})
	],
	server: {
		host: '0.0.0.0',
		port: 3000, // 端口号
		open: false, // 是否自动打开浏览器

		// 添加代理配置解决跨域问题
		proxy: {
			// 将 /new 前缀的请求转发到后端
			'/new': {
				target: 'http://localhost:8080', // 替换为你的后端服务地址
				changeOrigin: true,
				rewrite: path => path.replace(/^\/new/, '/new') // 如果后端路径没有变化则保留
			}
		}
	}
})
