<template>
	<el-dialog v-model="visible" :title="!dataForm.id ? '新增' : '修改'" :close-on-click-modal="false">
		<el-form ref="dataFormRef" :model="dataForm" :rules="dataRules" label-width="100px" @keyup.enter="submitHandle()">
	    				<el-form-item label="告警唯一标识符，自增主键" prop="alertId">
					<el-input v-model="dataForm.alertId" placeholder="告警唯一标识符，自增主键"></el-input>
				</el-form-item>
				<el-form-item label="关联的设备ID" prop="deviceId">
					<el-input v-model="dataForm.deviceId" placeholder="关联的设备ID"></el-input>
				</el-form-item>
				<el-form-item label="告警代码，用于快速识别告警类型" prop="alertCode">
					<el-input v-model="dataForm.alertCode" placeholder="告警代码，用于快速识别告警类型"></el-input>
				</el-form-item>
				<el-form-item label="告警标题" prop="title">
					<el-input v-model="dataForm.title" placeholder="告警标题"></el-input>
				</el-form-item>
				<el-form-item label="告警详细信息" prop="message">
					<el-input v-model="dataForm.message" placeholder="告警详细信息"></el-input>
				</el-form-item>
				<el-form-item label="告警创建时间" prop="createdAt">
					<el-input v-model="dataForm.createdAt" placeholder="告警创建时间"></el-input>
				</el-form-item>
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
import { useAlertsApi, useAlertsSubmitApi } from '@/api/maku/alerts'

const emit = defineEmits(['refreshDataList'])

const visible = ref(false)
const dataFormRef = ref()

const dataForm = reactive({
	alertId: '',
	deviceId: '',
	alertCode: '',
	title: '',
	message: '',
	createdAt: ''})

const init = (id?: number) => {
	visible.value = true
	dataForm.id = ''

	// 重置表单数据
	if (dataFormRef.value) {
		dataFormRef.value.resetFields()
	}

	if (id) {
		getAlerts(id)
	}
}

const getAlerts = (id: number) => {
	useAlertsApi(id).then(res => {
		Object.assign(dataForm, res.data)
	})
}

const dataRules = ref({
})

// 表单提交
const submitHandle = () => {
	dataFormRef.value.validate((valid: boolean) => {
		if (!valid) {
			return false
		}

		useAlertsSubmitApi(dataForm).then(() => {
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
