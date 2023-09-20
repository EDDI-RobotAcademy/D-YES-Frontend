import { useOptions } from "./useOptions";

export interface ProductModifyResponse {
  productId: number;
  productName: string;
  productSaleStatus: string;
  productDescription: string;
  produceType: string;
  cultivationMethod: string;
  productOptionList: useOptions[];
  farmName: string;
}
