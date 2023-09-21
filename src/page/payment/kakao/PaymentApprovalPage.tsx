import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { kakaoPaymentApprovalRequest } from "../api/PaymentApi";
import { toast } from "react-toastify";

const PaymentApprovalPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const params: URLSearchParams = new URLSearchParams(location.search);
  const pg_token: string = params.get("pg_token")!;
  const [paymentRequested, setPaymentRequested] = useState(false);

  useEffect(() => {
    if (!paymentRequested) {
      const fetchPaymentData = async () => {
        try {
          const data = await kakaoPaymentApprovalRequest(pg_token);
          if (data) {
            navigate("/payment/complete");
          } else {
            navigate("/payment/kakao/error");
          }
        } catch (error) {
          toast.error("결제 서버와의 통신에 실패했습니다");
        }
      };
      fetchPaymentData();
      setPaymentRequested(true);
    }
  }, [pg_token, paymentRequested]);

  return <div>결제 진행 중</div>;
};

export default PaymentApprovalPage;
