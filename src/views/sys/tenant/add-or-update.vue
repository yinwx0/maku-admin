<template>
	<el-dialog v-model="visible" :title="!dataForm.id ? '新增' : '修改'" :close-on-click-modal="false">
		<el-form ref="dataFormRef" :model="dataForm" :rules="dataRules" label-width="100px" @keyup.enter="submitHandle()">
	    				<el-form-item label="名称" prop="tenantName">
					<el-input v-model="dataForm.tenantName" placeholder="名称"></el-input>
				</el-form-item>
				<el-form-item label="联系人姓名" prop="contactPerson">
					<el-input v-model="dataForm.contactPerson" placeholder="联系人姓名"></el-input>
				</el-form-item>
				<el-form-item label="联系人电话" prop="contactPhone">
					<el-input v-model="dataForm.contactPhone" placeholder="联系人电话"></el-input>
				</el-form-item>
				<el-form-item label="联系人邮箱" prop="contactEmail">
					<el-input v-model="dataForm.contactEmail" placeholder="联系人邮箱"></el-input>
				</el-form-item>
				<el-form-item label="租户状态（0：未激活，1：已激活）" prop="status">
					<el-input v-model="dataForm.status" placeholder="租户状态（0：未激活，1：已激活）"></el-input>
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
import { useTenantApi, useTenantSubmitApi } from '@/api/business/tenant'

const emit = defineEmits(['refreshDataList'])

const visible = ref(false)
const dataFormRef = ref()

const dataForm = reactive({
	id: '',
	tenantName: '',
	contactPerson: '',
	contactPhone: '',
	contactEmail: '',
	status: '',
	createTime: '',
	updateTime: '',
	creator: '',
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
		getTenant(id)
	}
}

const getTenant = (id: number) => {
	useTenantApi(id).then(res => {
		Object.assign(dataForm, res.data)
	})
}

const dataRules = ref({
	tenantName: [{ required: true, message: '必填项不能为空', trigger: 'blur' }],
	contactPerson: [{ required: true, message: '必填项不能为空', trigger: 'blur' }],
	contactPhone: [{ required: true, message: '必填项不能为空', trigger: 'blur' }],
	contactEmail: [{ required: true, message: '必填项不能为空', trigger: 'blur' }],
	status: [{ required: true, message: '必填项不能为空', trigger: 'blur' }],
	orgId: [{ required: true, message: '必填项不能为空', trigger: 'blur' }]})

// 表单提交
const submitHandle = () => {
	dataFormRef.value.validate((valid: boolean) => {
		if (!valid) {
			return false
		}

		useTenantSubmitApi(dataForm).then(() => {
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
