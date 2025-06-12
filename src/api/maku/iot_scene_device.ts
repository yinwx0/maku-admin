import service from '@/utils/request'

export const useIot_scene_deviceApi = (id: number) => {
	return service.get('/new/maku/iot_scene_device/' + id)
}

export const useIot_scene_deviceSubmitApi = (dataForm: any) => {
	if (dataForm.id) {
		return service.put('/new/maku/iot_scene_device', dataForm)
	} else {
		return service.post('/new/maku/iot_scene_device', dataForm)
	}
}
