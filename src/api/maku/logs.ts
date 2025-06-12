import service from '@/utils/request'

export const useLogsApi = (id: number) => {
	return service.get('/new/maku/logs/' + id)
}

export const useLogsSubmitApi = (dataForm: any) => {
	if (dataForm.id) {
		return service.put('/new/maku/logs', dataForm)
	} else {
		return service.post('/new/maku/logs', dataForm)
	}
}