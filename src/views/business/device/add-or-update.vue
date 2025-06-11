<template>
	<el-dialog v-model="visible" :title="!dataForm.id ? '新增' : '修改'" :close-on-click-modal="false">
		<el-form ref="dataFormRef" :model="dataForm" :rules="dataRules" label-width="100px" @keyup.enter="submitHandle()">
			<el-form-item label="编码" prop="code">
				<el-input v-model="dataForm.code" placeholder="编码"></el-input>
			</el-form-item>
			<el-form-item label="名称" prop="name">
				<el-input v-model="dataForm.name" placeholder="名称"></el-input>
			</el-form-item>
			<el-form-item label="设备类型，1.手持设备，2.柜体，3传感设备" prop="type">
				<el-input v-model="dataForm.type" placeholder="设备类型，1.手持设备，2.柜体，3传感设备"></el-input>
			</el-form-item>
			<el-form-item label="唯一标识码" prop="uid">
				<el-input v-model="dataForm.uid" placeholder="唯一标识码"></el-input>
			</el-form-item>
			<!-- <el-form-item label="设备密钥" prop="secret">
				<el-input v-model="dataForm.secret" placeholder="设备密钥"></el-input>
			</el-form-item>
			<el-form-item label="App版本号" prop="appVersion">
				<el-input v-model="dataForm.appVersion" placeholder="App版本号"></el-input>
			</el-form-item>
			<el-form-item label="电池电量百分比" prop="batteryPercent">
				<el-input v-model="dataForm.batteryPercent" placeholder="电池电量百分比"></el-input>
			</el-form-item> -->
			<!-- <el-form-item label="温度" prop="temperature">
				<el-input v-model="dataForm.temperature" placeholder="温度"></el-input>
			</el-form-item> -->
			<el-form-item label="状态，0禁用，1启用" prop="status">
				<el-input v-model="dataForm.status" placeholder="状态，0禁用，1启用"></el-input>
			</el-form-item>
			<el-form-item label="运行状态，0.离线状态 1.在线状态 2.正常待机 3.用户使用中 4.OTA升级中" prop="runningStatus">
				<el-input v-model="dataForm.runningStatus" placeholder="运行状态，0.离线状态 1.在线状态 2.正常待机 3.用户使用中 4.OTA升级中"></el-input>
			</el-form-item>
			<el-form-item label="协议类型" prop="protocolType">
				<el-input v-model="dataForm.protocolType" placeholder="协议类型"></el-input>
			</el-form-item>
			<!-- <el-form-item label="上线时间" prop="upTime">
				<el-input v-model="dataForm.upTime" placeholder="上线时间"></el-input>
			</el-form-item>
			<el-form-item label="下线时间" prop="downTime">
				<el-input v-model="dataForm.downTime" placeholder="下线时间"></el-input>
			</el-form-item>
			<el-form-item label="租户ID" prop="tenantId">
				<el-input v-model="dataForm.tenantId" placeholder="租户ID"></el-input>
			</el-form-item> -->
		</el-form>
		<template #footer>
			<el-button @click="visible = false">取消</el-button>
			<el-button type="primary" @click="submitHandle()">确定</el-button>
		</template>
	</el-dialog>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'
import { ElMessage } from 'element-plus/es'
import { useDeviceApi, useDeviceSubmitApi } from '@/api/business/device'

const emit = defineEmits(['refreshDataList'])

const visible = ref(false)
const dataFormRef = ref()

const dataForm = reactive({
	id: '',
	code: '',
	name: '',
	type: '',
	uid: '',
	secret: '',
	appVersion: '',
	batteryPercent: '',
	temperature: '',
	status: '',
	runningStatus: '',
	protocolType: '',
	upTime: '',
	downTime: '',
	tenantId: '',
	creator: '',
	createTime: '',
	updater: '',
	updateTime: '',
	version: '',
	deleted: ''
})

const init = (id?: number) => {
	visible.value = true
	dataForm.id = ''

	// 重置表单数据
	if (dataFormRef.value) {
		dataFormRef.value.resetFields()
	}

	if (id) {
		getDevice(id)
	}
}

const getDevice = (id: number) => {
	useDeviceApi(id).then(res => {
		Object.assign(dataForm, res.data)
	})
}

const dataRules = ref({
	code: [{ required: true, message: '必填项不能为空', trigger: 'blur' }],
	name: [{ required: true, message: '必填项不能为空', trigger: 'blur' }],
	type: [{ required: true, message: '必填项不能为空', trigger: 'blur' }],
	uid: [{ required: true, message: '必填项不能为空', trigger: 'blur' }],
	secret: [{ required: true, message: '必填项不能为空', trigger: 'blur' }],
	appVersion: [{ required: true, message: '必填项不能为空', trigger: 'blur' }],
	batteryPercent: [{ required: true, message: '必填项不能为空', trigger: 'blur' }],
	temperature: [{ required: true, message: '必填项不能为空', trigger: 'blur' }],
	status: [{ required: true, message: '必填项不能为空', trigger: 'blur' }],
	runningStatus: [{ required: true, message: '必填项不能为空', trigger: 'blur' }],
	protocolType: [{ required: true, message: '必填项不能为空', trigger: 'blur' }],
	upTime: [{ required: true, message: '必填项不能为空', trigger: 'blur' }],
	downTime: [{ required: true, message: '必填项不能为空', trigger: 'blur' }],
	tenantId: [{ required: true, message: '必填项不能为空', trigger: 'blur' }]
})

// 表单提交
const submitHandle = () => {
	dataFormRef.value.validate((valid: boolean) => {
		if (!valid) {
			return false
		}

		useDeviceSubmitApi(dataForm).then(() => {
			ElMessage.success({
				message: '操作成功',
				duration: 500,
				onClose: () => {
					visible.value = false
					emit('refreshDataList')
				}
			})
		})
	})
}

defineExpose({
	init
})
</script>
