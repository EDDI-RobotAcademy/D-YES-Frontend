import { NewProductSummaryInfo } from "./NewProductSummaryInfo";
import { NewProductManagemantInfo } from "./NewProductManagemantInfo";

export interface ProductInfoResponse {
  productInfoResponseForAdminList: NewProductSummaryInfo[];
  registeredProductCountList: NewProductManagemantInfo[];
}
