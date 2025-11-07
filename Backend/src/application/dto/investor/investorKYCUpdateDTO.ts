export interface InvestorKYCUpdateDTO {
  id: string;
  aadharImg: File;
  selfieImg: File;
  formData: InvestorKYCUpdateFormData;
}

export interface InvestorKYCUpdateFormData {
  dateOfBirth: Date;
  phoneNumber: string;
  address: string;
}
