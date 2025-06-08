<template>
	<el-dialog v-model="visible" :title="!dataForm.id ? '新增' : '修改'" :close-on-click-modal="false">
		<el-form ref="dataFormRef" :model="dataForm" :rules="dataRules" label-width="100px" @keyup.enter="submitHandle()">
			<el-form-item label="封面图" prop="coverImage">
				<el-upload
					class="avatar-uploader"
					:show-file-list="false"
					:before-upload="beforeUpload"
					:http-request="customUpload"
					:on-error="handleUploadError"
				>
					<img v-if="dataForm.coverImage" :src="dataForm.coverImage" class="avatar" />
					<el-icon v-else class="avatar-uploader-icon">
						<Plus />
					</el-icon>
				</el-upload>
			</el-form-item>
			<el-form-item label="资讯标题" prop="title">
				<el-input v-model="dataForm.title" placeholder="资讯标题"></el-input>
			</el-form-item>
			<el-form-item label="资讯内容" prop="content">
				<ma-editor v-model="dataForm.content" style="width: 100%"></ma-editor>
			</el-form-item>
			<el-form-item label="是否轮播" prop="banner">
				<el-radio-group v-model="dataForm.banner">
					<el-radio-button label="0">不轮播</el-radio-button>
					<el-radio-button label="1">轮播</el-radio-button>
				</el-radio-group>
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
import { imageUploadApi } from '@/api/business/image'

const emit = defineEmits(['refreshDataList'])
// 自定义上传方法
const customUpload = (options: any) => {
	const { file } = options
	const formData = new FormData()
	formData.append('file', file) // 确保文件被正确附加到 FormData 中

	imageUploadApi(formData)
		.then((response: any) => {
			if (response.code === 0) {
				dataForm.coverImage = response.data // 更新封面图路径
			} else {
				ElMessage.error(response.msg || '上传失败，请稍后重试')
			}
		})
		.catch(() => {
			ElMessage.error('上传失败，请稍后重试')
		})
}

const visible = ref(false)
const dataFormRef = ref()

const dataForm = reactive({
	id: '',
	coverImage: '',
	title: '',
	content: '',
	createTime: '',
	creator: '10000',
	updateTime: '',
	updater: '10000',
	version: 0,
	deleted: 0,
	banner: 0
})

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
	content: [{ required: true, message: '必填项不能为空', trigger: 'change' }],
	banner: [{ required: true, message: '必填项不能为空', trigger: 'blur' }]
})

// 上传相关
const uploadUrl = ref('http://localhost:8080/new/business/image/upload') // 确保这是正确的后端接口地址

const beforeUpload = (file: File) => {
	// 可以在这里对上传的文件进行预处理
	return true
}

const handleAvatarSuccess = (response: any) => {
	// 假设服务器返回的图片URL在response.data中
	if (response.code === 0) {
		dataForm.coverImage = response.data
	} else {
		ElMessage.error(response.msg || '上传失败，请稍后重试')
	}
}

const handleUploadError = () => {
	ElMessage.error('上传失败，请稍后重试')
}

// 表单提交
const submitHandle = () => {
	dataFormRef.value.validate((valid: boolean) => {
		if (!valid) {
			return false
		}
		console.log('========================', dataForm)
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

<style>
.avatar-uploader .el-upload {
	border: 1px dashed var(--el-border-color);
	border-radius: 6px;
	cursor: pointer;
	position: relative;
	overflow: hidden;
	transition: var(--el-border-color 0.3s);
}

.avatar-uploader .el-upload:hover {
	border-color: var(--el-color-primary);
}

.avatar-uploader-icon {
	font-size: 28px;
	color: #8c939d;
	width: 178px;
	height: 178px;
	line-height: 178px;
	text-align: center;
}

.avatar {
	width: 178px;
	height: 178px;
	display: block;
}
</style>
