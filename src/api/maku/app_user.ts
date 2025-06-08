import service from '@/utils/request'

export const useApp_userApi = (id: number) => {
	return service.get('/new/maku/app_user/' + id)
}

export const useApp_userSubmitApi = (dataForm: any) => {
	if (dataForm.id) {
		return service.put('/new/maku/app_user', dataForm)
	} else {
		return service.post('/new/maku/app_user', dataForm)
	}
}
