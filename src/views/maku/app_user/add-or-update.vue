<template>
	<el-dialog v-model="visible" :title="!dataForm.id ? '新增' : '修改'" :close-on-click-modal="false">
		<el-form ref="dataFormRef" :model="dataForm" :rules="dataRules" label-width="100px" @keyup.enter="submitHandle()">
	    				<el-form-item label="ID" prop="id">
					<el-input v-model="dataForm.id" placeholder="ID"></el-input>
				</el-form-item>
				<el-form-item label="用户昵称" prop="userName">
					<el-input v-model="dataForm.userName" placeholder="用户昵称"></el-input>
				</el-form-item>
				<el-form-item label="用户头像" prop="avatarUrl">
					<el-input v-model="dataForm.avatarUrl" placeholder="用户头像"></el-input>
				</el-form-item>
				<el-form-item label="绑定手机号" prop="phone">
					<el-input v-model="dataForm.phone" placeholder="绑定手机号"></el-input>
				</el-form-item>
				<el-form-item label="密码" prop="password">
					<el-input v-model="dataForm.password" placeholder="密码"></el-input>
				</el-form-item>
				<el-form-item label="性别 0:未知 1:男 2:女" prop="gender">
					<el-input v-model="dataForm.gender" placeholder="性别 0:未知 1:男 2:女"></el-input>
				</el-form-item>
				<el-form-item label="状态 0:离线 1:在线" prop="status">
					<el-input v-model="dataForm.status" placeholder="状态 0:离线 1:在线"></el-input>
				</el-form-item>
				<el-form-item label="绑定设备数" prop="bindCount">
					<el-input v-model="dataForm.bindCount" placeholder="绑定设备数"></el-input>
				</el-form-item>
				<el-form-item label="最后活跃时间" prop="lastActive">
					<el-input v-model="dataForm.lastActive" placeholder="最后活跃时间"></el-input>
				</el-form-item>
				<el-form-item label="创建时间" prop="createTime">
					<el-input v-model="dataForm.createTime" placeholder="创建时间"></el-input>
				</el-form-item>
				<el-form-item label="更新时间" prop="updateTime">
					<el-input v-model="dataForm.updateTime" placeholder="更新时间"></el-input>
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
import { useApp_userApi, useApp_userSubmitApi } from '@/api/maku/app_user'

const emit = defineEmits(['refreshDataList'])

const visible = ref(false)
const dataFormRef = ref()

const dataForm = reactive({
	id: '',
	userName: '',
	avatarUrl: '',
	phone: '',
	password: '',
	gender: '',
	status: '',
	bindCount: '',
	lastActive: '',
	createTime: '',
	updateTime: '',
	deleted: ''})

const init = (id?: number) => {
	visible.value = true
	dataForm.id = ''

	// 重置表单数据
	if (dataFormRef.value) {
		dataFormRef.value.resetFields()
	}

	if (id) {
		getApp_user(id)
	}
}

const getApp_user = (id: number) => {
	useApp_userApi(id).then(res => {
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

		useApp_userSubmitApi(dataForm).then(() => {
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
