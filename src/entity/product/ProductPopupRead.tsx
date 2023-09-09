import { Product } from "./Product";
import { useOptions } from "./useOptions";
import { Farm } from "entity/farm/Farm";

export interface ProductPopupRead {
  productSummaryResponseForAdmin: Product;
  optionSummaryResponseForAdmin: useOptions[];
  farmInfoSummaryResponseForAdmin: Farm;
}
