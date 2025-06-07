<template>
	<el-dialog v-model="visible" :title="!dataForm.id ? '新增' : '修改'" :close-on-click-modal="false">
		<el-form ref="dataFormRef" :model="dataForm" :rules="dataRules" label-width="100px" @keyup.enter="submitHandle()">
	    				<el-form-item label="封面图URL" prop="coverImage">
					<el-input v-model="dataForm.coverImage" placeholder="封面图URL"></el-input>
				</el-form-item>
				<el-form-item label="资讯标题" prop="title">
					<el-input v-model="dataForm.title" placeholder="资讯标题"></el-input>
				</el-form-item>
				<el-form-item label="资讯内容（富文本HTML格式）" prop="content">
					<el-input v-model="dataForm.content" placeholder="资讯内容（富文本HTML格式）"></el-input>
				</el-form-item>
				<el-form-item label="是否轮播（0：不轮播 1：轮播）" prop="banner">
					<el-input v-model="dataForm.banner" placeholder="是否轮播（0：不轮播 1：轮播）"></el-input>
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
import { useInformationApi, useInformationSubmitApi } from '@/api/business/information'

const emit = defineEmits(['refreshDataList'])

const visible = ref(false)
const dataFormRef = ref()

const dataForm = reactive({
	id: '',
	coverImage: '',
	title: '',
	content: '',
	createTime: '',
	creator: '',
	updateTime: '',
	updater: '',
	version: '',
	deleted: '',
	banner: '',})

const init = (id?: number) => {
	visible.value = true
	dataForm.id = ''

	// 重置表单数据
	if (dataFormRef.value) {
		dataFormRef.value.resetFields()
	}

	if (id) {
		getInformation(id)
	}
}

const getInformation = (id: number) => {
	useInformationApi(id).then(res => {
		Object.assign(dataForm, res.data)
	})
}

const dataRules = ref({
	coverImage: [{ required: true, message: '必填项不能为空', trigger: 'blur' }],
	title: [{ required: true, message: '必填项不能为空', trigger: 'blur' }],
	content: [{ required: true, message: '必填项不能为空', trigger: 'blur' }],
	banner: [{ required: true, message: '必填项不能为空', trigger: 'blur' }],
})

// 表单提交
const submitHandle = () => {
	dataFormRef.value.validate((valid: boolean) => {
		if (!valid) {
			return false
		}

		useInformationSubmitApi(dataForm).then(() => {
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
