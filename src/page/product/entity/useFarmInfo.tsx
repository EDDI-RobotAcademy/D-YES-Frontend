export interface useFarmInfo {
  farmName: string;
  csContactNumber: string;
  farmAddress: addressCode;
  mainImage: string;
  introduction: string;
  produceTypes: string;
}

export interface addressCode {
  address: string;
  addressDetail: string;
  zipCode: string;
}
