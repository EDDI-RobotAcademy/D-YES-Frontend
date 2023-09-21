import { useAuth } from "layout/navigation/AuthConText";
import { fetchOrderRead } from "page/admin/api/AdminApi";
import AdminOrderData from "page/order/components/AdminOrderData";
import AdminOrderPaymentData from "page/order/components/AdminOrderPaymentData";
import { useOrderDataStore } from "page/order/store/OrderDataStore";
import { usePaymentDataStore } from "page/order/store/OrderPaymentStore";
import React, { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";

const AdminOrderReadPage = () => {
  const navigate = useNavigate();
  const { checkAdminAuthorization } = useAuth();
  const isAdmin = checkAdminAuthorization();
  const { productOrderId } = useParams();
  const { setOrderDataInfo } = useOrderDataStore();
  const { setPaymentDataInfo } = usePaymentDataStore();

  useEffect(() => {
    if (!isAdmin) {
      toast.error("권한이 없습니다.");
      navigate("/");
    }
  }, [isAdmin, navigate]);

  if (!isAdmin) {
    return null;
  }

  useEffect(() => {
    const fetchOrderReadDetail = async () => {
      const data = await fetchOrderRead(productOrderId || "");
      if (data?.orderData) {
        setOrderDataInfo(data.orderData);
      }
      if (data?.paymentData) {
        setPaymentDataInfo(data.paymentData);
      }
      console.log("상세정보", data);
    };
    fetchOrderReadDetail();
  }, [productOrderId]);

  return (
    <div>
      <AdminOrderData />
      <AdminOrderPaymentData />
    </div>
  );
};

export default AdminOrderReadPage;
