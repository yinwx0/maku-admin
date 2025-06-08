import service from '@/utils/request'

export const useLogsApi = (id: number) => {
	return service.get('/maku-cloud-log/maku/logs/' + id)
}

export const useLogsSubmitApi = (dataForm: any) => {
	if (dataForm.id) {
		return service.put('/maku-cloud-log/maku/logs', dataForm)
	} else {
		return service.post('/maku-cloud-log/maku/logs', dataForm)
	}
}