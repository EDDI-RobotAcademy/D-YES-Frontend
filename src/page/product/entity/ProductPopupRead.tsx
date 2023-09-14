import { Product } from "./Product";
import { useOptions } from "./useOptions";
import { Farm } from "page/farm/entity/farm/Farm";

export interface ProductPopupRead {
  productSummaryResponseForAdmin: Product;
  optionSummaryResponseForAdmin: useOptions[];
  farmInfoSummaryResponseForAdmin: Farm;
}
