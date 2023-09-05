import { Farm } from "page/farm/entity/Farm";
import { Product } from "./Product";
import { useOptions } from "./useOptions";

export interface ProductPopupRead {
  productSummaryResponseForAdmin: Product;
  optionSummaryResponseForAdmin: useOptions[];
  farmInfoSummaryResponseForAdmin: Farm;
}
