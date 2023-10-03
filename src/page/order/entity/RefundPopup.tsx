import { RefundPopupOptionList } from "./RefundPopupOptionList";

export interface RefundPopup {
  productId: number;
  productName: string;
  orderOptionList: RefundPopupOptionList[];
}
