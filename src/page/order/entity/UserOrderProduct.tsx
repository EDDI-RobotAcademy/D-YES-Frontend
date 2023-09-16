import { OrderOptionListResponse } from "./UserOrderOption";

export interface OrderProductListResponse {
  productId: number;
  productName: string;
  orderOptionList: OrderOptionListResponse[];
}
