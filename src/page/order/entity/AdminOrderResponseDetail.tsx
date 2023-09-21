import { AdminOrderDetail } from "./AdminOrderDetail";
import { AdminOrderProfile } from "./AdminOrderProfile";
import { AdminPayment } from "./AdminPayment";
import { AdminProductData } from "./AdminProductData";

export interface AdminOrderResponseDetail {
  orderData: AdminOrderDetail;
  paymentData: AdminPayment;
  productDataList: AdminProductData;
  profileData: AdminOrderProfile;
}