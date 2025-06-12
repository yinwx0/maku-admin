import service from '@/utils/request'

export const useTenantApi = (id: number) => {
	return service.get('/business/tenant/' + id)
}

export const useTenantSubmitApi = (dataForm: any) => {
	if (dataForm.id) {
		return service.put('/business/tenant', dataForm)
	} else {
		return service.post('/business/tenant', dataForm)
	}
}
