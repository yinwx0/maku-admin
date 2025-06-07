import service from '@/utils/request'

export const useAgreementApi = (id: number) => {
	return service.get('new/business/agreement/' + id)
}

export const useAgreementSubmitApi = (dataForm: any) => {
	if (dataForm.id) {
		return service.put('new/business/agreement', dataForm)
	} else {
		return service.post('new/business/agreement', dataForm)
	}
}
