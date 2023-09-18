import React, { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { kakaoPaymentApprovalRequest } from "../api/PaymentApi";
import { toast } from "react-toastify";

const PaymentApprovalPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const params: URLSearchParams = new URLSearchParams(location.search);
  const pg_token: string = params.get("pg_token")!;

  useEffect(() => {
    const fetchpaymentData = async () => {
      try {
        const data = await kakaoPaymentApprovalRequest(pg_token);
        if (data) {
          navigate("/payment/complete");
        } else {
          toast.error("결제 승인 요청 중 오류가 발생했습니다");
          return;
        }
      } catch (error) {
        toast.error("결제 서버와의 통신에 실패했습니다");
      }
    };
    fetchpaymentData();
  }, [pg_token]);

  return <div>결제 진행 중</div>;
};

export default PaymentApprovalPage;
