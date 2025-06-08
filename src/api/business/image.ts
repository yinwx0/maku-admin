import service from '@/utils/request'

export const imageUploadApi = (formData: FormData) => {
	return service.post('/new/business/image/upload', formData, {
		headers: {
			'Content-Type': 'multipart/form-data' // 显式设置请求头
		}
	})
}
