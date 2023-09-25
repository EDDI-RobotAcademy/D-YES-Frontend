export interface EventProduct {
  userToken: string;
  productName: string;
  productDescription: string;
  cultivationMethod: string;
  produceType: string;
  optionName: string;
  optionPrice: number;
  stock: number;
  value: number;
  unit: string;
  mainImg: File;
  detailImgs: File[];
  farmName: string;
}
