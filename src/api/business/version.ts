import service from '@/utils/request'

export const useVersionApi = (id: number) => {
	return service.get('new/business/version/' + id)
}

export const useVersionSubmitApi = (dataForm: any) => {
	if (dataForm.id) {
		return service.put('new/business/version', dataForm)
	} else {
		return service.post('new/business/version', dataForm)
	}
}
