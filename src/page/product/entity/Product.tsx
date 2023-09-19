import { useOptions } from "./useOptions";

export interface Product {
  productId: number;
  productName: string;
  productSaleStatus: string;
  produceTypes: string;
  productDescription: string;
  cultivationMethod: string;
  productOptionList: useOptions[];
  farmName: string;
}
