import { Farm } from "page/farm/entity/Farm";
import { useOptions } from "./useOptions";

export interface Product {
  productId: number;
  productName: string;
  productSaleStatus: string;
  productDescription: string;
  cultivationMethod: string;
  productOptionListResponse: useOptions[];
  farmName: string;
}
