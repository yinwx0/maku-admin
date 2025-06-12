<template>
	<el-card class="layout-query">
		<el-form ref="queryRef" :inline="true" :model="state.queryForm" @keyup.enter="getDataList()">
			<el-form-item>
				<el-button icon="Search" type="primary" @click="getDataList()">查询</el-button>
			</el-form-item>
			<el-form-item>
				<el-button icon="RefreshRight" @click="reset(queryRef)">重置</el-button>
			</el-form-item>
		</el-form>
	</el-card>

	<el-card>
		<el-space>
			<el-space>
				<el-button v-auth="'business:device:save'" icon="Plus" type="primary" @click="addOrUpdateHandle()">新增</el-button>
			</el-space>
			<el-space>
				<el-button v-auth="'business:device:delete'" icon="Delete" plain type="danger" @click="deleteBatchHandle()">批量删除</el-button>
			</el-space>
		</el-space>
		<el-table v-loading="state.dataListLoading" :data="state.dataList" border class="layout-table" @selection-change="selectionChangeHandle">
			<el-table-column type="selection" header-align="center" align="center" width="50"></el-table-column>
			<el-table-column prop="id" label="ID" header-align="center" align="center"></el-table-column>
			<el-table-column prop="code" label="编码" header-align="center" align="center"></el-table-column>
			<el-table-column prop="name" label="名称" header-align="center" align="center"></el-table-column>
			<el-table-column prop="type" label="设备类型，1.手持设备，2.柜体，3传感设备" header-align="center" align="center"></el-table-column>
			<el-table-column prop="uid" label="唯一标识码" header-align="center" align="center"></el-table-column>
			<el-table-column prop="secret" label="设备密钥" header-align="center" align="center"></el-table-column>
			<el-table-column prop="appVersion" label="App版本号" header-align="center" align="center"></el-table-column>
			<el-table-column prop="batteryPercent" label="电池电量百分比" header-align="center" align="center"></el-table-column>
			<el-table-column prop="temperature" label="温度" header-align="center" align="center"></el-table-column>
			<el-table-column prop="status" label="状态，0禁用，1启用" header-align="center" align="center"></el-table-column>
			<el-table-column
				prop="runningStatus"
				label="运行状态，0.离线状态 1.在线状态 2.正常待机 3.用户使用中 4.OTA升级中"
				header-align="center"
				align="center"
			></el-table-column>
			<el-table-column prop="protocolType" label="协议类型" header-align="center" align="center"></el-table-column>
			<el-table-column prop="upTime" label="上线时间" header-align="center" align="center"></el-table-column>
			<el-table-column prop="downTime" label="下线时间" header-align="center" align="center"></el-table-column>
			<el-table-column prop="tenantId" label="租户ID" header-align="center" align="center"></el-table-column>
			<el-table-column label="操作" fixed="right" header-align="center" align="center" width="150">
				<template #default="scope">
					<el-button v-auth="'business:device:update'" type="primary" link @click="addOrUpdateHandle(scope.row.id)">修改</el-button>
					<el-button v-auth="'business:device:delete'" type="primary" link @click="deleteBatchHandle(scope.row.id)">删除</el-button>
				</template>
			</el-table-column>
		</el-table>
		<el-pagination
			:current-page="state.page"
			:page-sizes="state.pageSizes"
			:page-size="state.limit"
			:total="state.total"
			layout="total, sizes, prev, pager, next, jumper"
			@size-change="sizeChangeHandle"
			@current-change="currentChangeHandle"
		>
		</el-pagination>

		<!-- 弹窗, 新增 / 修改 -->
		<add-or-update ref="addOrUpdateRef" @refresh-data-list="getDataList"></add-or-update>
	</el-card>
</template>

<script setup lang="ts" name="BusinessDeviceIndex">
import { useCrud } from '@/hooks'
import { reactive, ref } from 'vue'
import { IHooksOptions } from '@/hooks/interface'
import AddOrUpdate from './add-or-update.vue'

const state: IHooksOptions = reactive({
	dataListUrl: '/business/device/page',
	deleteUrl: '/business/device',
	queryForm: {}
})

const queryRef = ref()
const addOrUpdateRef = ref()
const addOrUpdateHandle = (id?: number) => {
	addOrUpdateRef.value.init(id)
}

const { getDataList, selectionChangeHandle, sizeChangeHandle, currentChangeHandle, deleteBatchHandle, reset } = useCrud(state)
</script>
