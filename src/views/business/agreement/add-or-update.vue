<template>
	<el-dialog v-model="visible" :title="!dataForm.id ? '新增' : '修改'" :close-on-click-modal="false">
		<el-form ref="dataFormRef" :model="dataForm" :rules="dataRules" label-width="100px" @keyup.enter="submitHandle()">
			<el-form-item label="协议标题" prop="title">
				<el-input v-model="dataForm.title" placeholder="协议标题"></el-input>
			</el-form-item>
			<el-form-item label="协议内容" prop="content">
				<el-input v-model="dataForm.content" placeholder="协议内容"></el-input>
			</el-form-item>
			<el-form-item label="协议版本" prop="agreementVersion">
				<el-input v-model="dataForm.agreementVersion" placeholder="协议版本"></el-input>
			</el-form-item>
			<el-form-item label="协议状态（0：不可用，1：可用）" prop="status">
				<el-input v-model="dataForm.status" placeholder="协议状态（0：不可用，1：可用）"></el-input>
			</el-form-item>
			<el-form-item label="创建者所属机构" prop="orgId">
				<el-input v-model="dataForm.orgId" placeholder="创建者所属机构"></el-input>
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
import { useAgreementApi, useAgreementSubmitApi } from '@/api/business/agreement'

const emit = defineEmits(['refreshDataList'])

const visible = ref(false)
const dataFormRef = ref()

const dataForm = reactive({
	id: '',
	title: '',
	content: '',
	agreementVersion: '',
	status: '',
	createTime: '',
	creator: '',
	updateTime: '',
	updater: '',
	orgId: '',
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
		getAgreement(id)
	}
}

const getAgreement = (id: number) => {
	useAgreementApi(id).then(res => {
		Object.assign(dataForm, res.data)
	})
}

const dataRules = ref({
	title: [{ required: true, message: '必填项不能为空', trigger: 'blur' }],
	content: [{ required: true, message: '必填项不能为空', trigger: 'blur' }],
	agreementVersion: [{ required: true, message: '必填项不能为空', trigger: 'blur' }],
	status: [{ required: true, message: '必填项不能为空', trigger: 'blur' }],
	orgId: [{ required: true, message: '必填项不能为空', trigger: 'blur' }]
})

// 表单提交
const submitHandle = () => {
	dataFormRef.value.validate((valid: boolean) => {
		if (!valid) {
			return false
		}

		useAgreementSubmitApi(dataForm).then(() => {
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
