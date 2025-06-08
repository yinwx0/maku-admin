import service from '@/utils/request'

export const useInformationApi = (id: number) => {
	return service.get('/new/business/information/' + id)
}

export const useInformationSubmitApi = (dataForm: any) => {
	if (dataForm.id) {
		return service.put('/new/business/information', dataForm)
	} else {
		return service.post('/new/business/information', dataForm)
	}
}