import { useOptions } from "./useOptions";

export interface Product {
  productId: number;
  productName: string;
  productDescription: string;
  cultivationMethod: string;
  productOptionListResponse: useOptions[];
}
