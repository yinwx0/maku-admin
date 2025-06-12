<template>
	<el-dialog v-model="visible" :title="!dataForm.id ? '新增' : '修改'" :close-on-click-modal="false">
		<el-form ref="dataFormRef" :model="dataForm" :rules="dataRules" label-width="100px" @keyup.enter="submitHandle()">
	    				<el-form-item label="关联ID" prop="id">
					<el-input v-model="dataForm.id" placeholder="关联ID"></el-input>
				</el-form-item>
				<el-form-item label="场景ID" prop="sceneId">
					<el-input v-model="dataForm.sceneId" placeholder="场景ID"></el-input>
				</el-form-item>
				<el-form-item label="设备ID" prop="deviceId">
					<el-input v-model="dataForm.deviceId" placeholder="设备ID"></el-input>
				</el-form-item>
				<el-form-item label="设备在场景中的排序" prop="sort">
					<el-input v-model="dataForm.sort" placeholder="设备在场景中的排序"></el-input>
				</el-form-item>
				<el-form-item label="创建时间" prop="createTime">
					<el-input v-model="dataForm.createTime" placeholder="创建时间"></el-input>
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
import { useIot_scene_deviceApi, useIot_scene_deviceSubmitApi } from '@/api/maku/iot_scene_device'

const emit = defineEmits(['refreshDataList'])

const visible = ref(false)
const dataFormRef = ref()

const dataForm = reactive({
	id: '',
	sceneId: '',
	deviceId: '',
	sort: '',
	createTime: ''})

const init = (id?: number) => {
	visible.value = true
	dataForm.id = ''

	// 重置表单数据
	if (dataFormRef.value) {
		dataFormRef.value.resetFields()
	}

	if (id) {
		getIot_scene_device(id)
	}
}

const getIot_scene_device = (id: number) => {
	useIot_scene_deviceApi(id).then(res => {
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

		useIot_scene_deviceSubmitApi(dataForm).then(() => {
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
