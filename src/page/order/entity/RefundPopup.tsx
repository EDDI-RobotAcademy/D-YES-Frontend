import { OrderOptionListResponse } from "./UserOrderOption";

export interface RefundPopup {
  productId: number;
  productName: string;
  orderOptionList: OrderOptionListResponse[];
}
