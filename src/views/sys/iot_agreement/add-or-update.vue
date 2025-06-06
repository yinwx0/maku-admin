<template>
	<el-dialog v-model="visible" :title="!dataForm.id ? '新增' : '修改'" :close-on-click-modal="false">
		<el-form ref="dataFormRef" :model="dataForm" :rules="dataRules" label-width="100px" @keyup.enter="submitHandle()">
	    				<el-form-item label="协议ID" prop="id">
					<el-input v-model="dataForm.id" placeholder="协议ID"></el-input>
				</el-form-item>
				<el-form-item label="协议标题" prop="title">
					<el-input v-model="dataForm.title" placeholder="协议标题"></el-input>
				</el-form-item>
				<el-form-item label="协议内容" prop="content">
					<el-input v-model="dataForm.content" placeholder="协议内容"></el-input>
				</el-form-item>
				<el-form-item label="版本号" prop="version">
					<el-input v-model="dataForm.version" placeholder="版本号"></el-input>
				</el-form-item>
				<el-form-item label="协议版本" prop="agreementVersion">
					<el-input v-model="dataForm.agreementVersion" placeholder="协议版本"></el-input>
				</el-form-item>
				<el-form-item label="协议状态（0：不可用，1：可用）" prop="status">
					<el-input v-model="dataForm.status" placeholder="协议状态（0：不可用，1：可用）"></el-input>
				</el-form-item>
				<el-form-item label="创建时间" prop="createTime">
					<el-input v-model="dataForm.createTime" placeholder="创建时间"></el-input>
				</el-form-item>
				<el-form-item label="创建者" prop="creator">
					<el-input v-model="dataForm.creator" placeholder="创建者"></el-input>
				</el-form-item>
				<el-form-item label="更新时间" prop="updateTime">
					<el-input v-model="dataForm.updateTime" placeholder="更新时间"></el-input>
				</el-form-item>
				<el-form-item label="更新者" prop="updater">
					<el-input v-model="dataForm.updater" placeholder="更新者"></el-input>
				</el-form-item>
				<el-form-item label="创建者所属机构" prop="orgId">
					<el-input v-model="dataForm.orgId" placeholder="创建者所属机构"></el-input>
				</el-form-item>
				<el-form-item label="删除标识" prop="deleted">
					<el-input v-model="dataForm.deleted" placeholder="删除标识"></el-input>
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
import { useIot_agreementApi, useIot_agreementSubmitApi } from '@/api/maku/iot_agreement'

const emit = defineEmits(['refreshDataList'])

const visible = ref(false)
const dataFormRef = ref()

const dataForm = reactive({
	id: '',
	title: '',
	content: '',
	version: '',
	agreementVersion: '',
	status: '',
	createTime: '',
	creator: '',
	updateTime: '',
	updater: '',
	orgId: '',
	deleted: ''})

const init = (id?: number) => {
	visible.value = true
	dataForm.id = ''

	// 重置表单数据
	if (dataFormRef.value) {
		dataFormRef.value.resetFields()
	}

	if (id) {
		getIot_agreement(id)
	}
}

const getIot_agreement = (id: number) => {
	useIot_agreementApi(id).then(res => {
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

		useIot_agreementSubmitApi(dataForm).then(() => {
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
