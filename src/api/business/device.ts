import service from '@/utils/request'

export const useDeviceApi = (id: number) => {
	return service.get('/business/device/' + id)
}

export const useDeviceSubmitApi = (dataForm: any) => {
	if (dataForm.id) {
		return service.put('/business/device', dataForm)
	} else {
		return service.post('/business/device', dataForm)
	}
}
