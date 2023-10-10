import { AdminOrderDetail } from "./AdminOrderDetail";
import { AdminOrderUserInfo } from "./AdminOrderUserInfo";
import { OrderUser } from "./OrderUser";

export interface AdminOrderList {
  totalOrderCount: number;
  orderUserInfo: AdminOrderUserInfo;
  orderProductList: OrderUser;
  orderDetailInfoResponse: AdminOrderDetail;
}
