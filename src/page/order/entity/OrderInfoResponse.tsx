import { NewOrderSummaryInfo } from "./NewOrderSummaryInfo";
import { NewOrderManagemantInfo } from "./NewOrderManagemantInfo";

export interface OrderInfoResponse {
  orderInfoResponseForAdminList: NewOrderSummaryInfo[];
  createdOrderCountList: NewOrderManagemantInfo[];
}
