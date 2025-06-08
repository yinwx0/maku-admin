import service from '@/utils/request'

export const useIot_versionApi = (id: number) => {
	return service.get('new/maku/iot_version/' + id)
}

export const useIot_versionSubmitApi = (dataForm: any) => {
	if (dataForm.id) {
		return service.put('new/maku/iot_version', dataForm)
	} else {
		return service.post('new/maku/iot_version', dataForm)
	}
}
