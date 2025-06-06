import service from '@/utils/request'

export const useAlertsApi = (id: number) => {
	return service.get('/maku-cloud-management/maku/alerts/' + id)
}

export const useAlertsSubmitApi = (dataForm: any) => {
	if (dataForm.id) {
		return service.put('/maku-cloud-management/maku/alerts', dataForm)
	} else {
		return service.post('/maku-cloud-management/maku/alerts', dataForm)
	}
}