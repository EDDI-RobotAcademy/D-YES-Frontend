import { useOptions } from "./useOptions";

export interface Product {
  productId: number;
  productName: string;
  productSaleStatus: string;
  produceType: string;
  productDescription: string;
  cultivationMethod: string;
  productOptionList: useOptions[];
  farmName: string;
}
