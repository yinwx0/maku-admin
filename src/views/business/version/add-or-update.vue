<template>
	<el-dialog v-model="visible" :title="!dataForm.id ? '新增' : '修改'" :close-on-click-modal="false">
		<el-form ref="dataFormRef" :model="dataForm" :rules="dataRules" label-width="100px" @keyup.enter="submitHandle()">
	    				<el-form-item label="版本号" prop="versionNumber">
					<el-input v-model="dataForm.versionNumber" placeholder="版本号"></el-input>
				</el-form-item>
				<el-form-item label="发布日期" prop="releaseDate">
					<el-input v-model="dataForm.releaseDate" placeholder="发布日期"></el-input>
				</el-form-item>
				<el-form-item label="更新内容" prop="updateContent">
					<el-input v-model="dataForm.updateContent" placeholder="更新内容"></el-input>
				</el-form-item>
				<el-form-item label="版本状态（0：不可用，1：可用）" prop="status">
					<el-input v-model="dataForm.status" placeholder="版本状态（0：不可用，1：可用）"></el-input>
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
import { useVersionApi, useVersionSubmitApi } from '@/api/business/version'

const emit = defineEmits(['refreshDataList'])

const visible = ref(false)
const dataFormRef = ref()

const dataForm = reactive({
	id: '',
	versionNumber: '',
	releaseDate: '',
	updateContent: '',
	status: '',
	createTime: '',
	creator: '',
	updateTime: '',
	updater: '',
	orgId: '',
	version: '',
	deleted: ''})

const init = (id?: number) => {
	visible.value = true
	dataForm.id = ''

	// 重置表单数据
	if (dataFormRef.value) {
		dataFormRef.value.resetFields()
	}

	if (id) {
		getVersion(id)
	}
}

const getVersion = (id: number) => {
	useVersionApi(id).then(res => {
		Object.assign(dataForm, res.data)
	})
}

const dataRules = ref({
	versionNumber: [{ required: true, message: '必填项不能为空', trigger: 'blur' }],
	releaseDate: [{ required: true, message: '必填项不能为空', trigger: 'blur' }],
	updateContent: [{ required: true, message: '必填项不能为空', trigger: 'blur' }],
	status: [{ required: true, message: '必填项不能为空', trigger: 'blur' }],
	orgId: [{ required: true, message: '必填项不能为空', trigger: 'blur' }]})

// 表单提交
const submitHandle = () => {
	dataFormRef.value.validate((valid: boolean) => {
		if (!valid) {
			return false
		}

		useVersionSubmitApi(dataForm).then(() => {
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
