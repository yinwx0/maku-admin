import service from '@/utils/request'

export const useIot_agreementApi = (id: number) => {
	return service.get('new/maku/iot_agreement/' + id)
}

export const useIot_agreementSubmitApi = (dataForm: any) => {
	if (dataForm.id) {
		return service.put('new/maku/iot_agreement', dataForm)
	} else {
		return service.post('new/maku/iot_agreement', dataForm)
	}
}
