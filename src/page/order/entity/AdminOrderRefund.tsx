import { OrderRefundDetailInfo } from "./OrderRefundDetailInfo";
import { OrderUserInfo } from "./OrderUserInfo";

export interface AdminOrderRefund {
  orderUserInfo: OrderUserInfo;
  orderRefundDetailInfoResponse: OrderRefundDetailInfo;
}
