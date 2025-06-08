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
				<el-button v-auth="'business:information:save'" icon="Plus" type="primary" @click="addOrUpdateHandle()">新增</el-button>
			</el-space>
			<el-space>
				<el-button v-auth="'business:information:delete'" icon="Delete" plain type="danger" @click="deleteBatchHandle()">批量删除</el-button>
			</el-space>
		</el-space>
		<el-table v-loading="state.dataListLoading" :data="state.dataList" border class="layout-table" @selection-change="selectionChangeHandle">
			<el-table-column type="selection" header-align="center" align="center" width="50"></el-table-column>
			<el-table-column prop="id" label="ID" header-align="center" align="center" width="50"></el-table-column>
			<el-table-column label="封面图" header-align="center" align="center" width="200">
				<template #default="scope">
					<el-image
						v-if="scope.row.coverImage"
						style="width: 80px; height: 50px; border-radius: 4px"
						:src="scope.row.coverImage"
						:preview-src-list="[scope.row.coverImage]"
						fit="cover"
						hide-on-click-modal
						preview-teleported
					>
						<template #error>
							<div class="image-error">加载失败</div>
						</template>
					</el-image>
					<span v-else>无封面</span>
				</template>
			</el-table-column>
			<el-table-column prop="title" label="资讯标题" header-align="center" align="center"></el-table-column>
			<el-table-column label="资讯内容" header-align="center" align="center">
				<template #default="scope">
					<div v-html="scope.row.content" class="rich-text-content"></div>
				</template>
			</el-table-column>
			<el-table-column prop="banner" label="是否轮播" header-align="center" align="center">
				<template #default="scope">
					<el-tag :type="scope.row.banner === 1 ? 'success' : 'info'">
						{{ scope.row.banner === 1 ? '轮播中' : '不轮播' }}
					</el-tag>
				</template>
			</el-table-column>
			<el-table-column label="操作" fixed="right" header-align="center" align="center" width="150">
				<template #default="scope">
					<el-button v-auth="'business:information:update'" type="primary" link @click="addOrUpdateHandle(scope.row.id)">修改</el-button>
					<el-button v-auth="'business:information:delete'" type="primary" link @click="deleteBatchHandle(scope.row.id)">删除</el-button>
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
		></el-pagination>

		<!-- 弹窗, 新增 / 修改 -->
		<add-or-update ref="addOrUpdateRef" @refreshDataList="getDataList"></add-or-update>
	</el-card>
</template>

<script setup lang="ts" name="BusinessInformationIndex">
import { useCrud } from '@/hooks'
import { reactive, ref } from 'vue'
import { IHooksOptions } from '@/hooks/interface'
import AddOrUpdate from './add-or-update.vue'

const state: IHooksOptions = reactive({
	dataListUrl: '/new/business/information/page',
	deleteUrl: '/new/business/information',
	queryForm: {}
})

const queryRef = ref()
const addOrUpdateRef = ref()
const addOrUpdateHandle = (id?: number) => {
	addOrUpdateRef.value.init(id)
}

const { getDataList, selectionChangeHandle, sizeChangeHandle, currentChangeHandle, deleteBatchHandle, reset } = useCrud(state)
</script>

<style scoped>
.image-error {
	display: flex;
	justify-content: center;
	align-items: center;
	width: 100%;
	height: 100%;
	background: #f5f7fa;
	color: #909399;
	font-size: 12px;
}

.rich-text-content {
	max-height: 100px;
	overflow: hidden;
	text-overflow: ellipsis;
	display: -webkit-box;
	-webkit-line-clamp: 3;
	-webkit-box-orient: vertical;
	line-height: 1.5;
}

/* 深度选择器处理富文本内容 */
.rich-text-content :deep(img) {
	max-width: 100%;
	height: auto;
}

.rich-text-content :deep(*) {
	margin: 0;
	padding: 0;
	line-height: inherit;
}

.rich-text-content :deep(p) {
	margin-bottom: 0.5em;
}
</style>
