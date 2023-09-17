import { OrderProductListResponse } from "./UserOrderProduct";
import { OrderDetailInfoResponse } from "./UserOrderDetail";

export interface UserOrderList {
  orderProductList: OrderProductListResponse[];
  orderDetailInfoResponse: OrderDetailInfoResponse;
}
