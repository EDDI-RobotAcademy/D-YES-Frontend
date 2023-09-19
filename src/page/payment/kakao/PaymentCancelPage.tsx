import React, { useEffect } from "react";
import { Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { kakaoPaymentRejectRequest } from "../api/PaymentApi";
import { toast } from "react-toastify";

import "../css/PaymentFail.css";

const PaymentCancelPage: React.FC = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPaymentData = async () => {
      try {
        const data = await kakaoPaymentRejectRequest();
        if (data) {
          toast.error("결제가 취소되었습니다");
        } else {
          toast.error("결제 취소 요청 중 오류가 발생했습니다");
        }
      } catch (error) {
        toast.error("결제 취소 중 오류가 발생했습니다");
      }
    };
    fetchPaymentData();
  }, []);

  const goHome = () => {
    navigate("/");
  };

  return (
    <div>
      <div className="payment-fail">
        <div className="payment-fail-name">결제가 취소됐습니다</div>
        <Button size="large" variant="outlined" onClick={goHome}>
          메인으로
        </Button>
      </div>
    </div>
  );
};

export default PaymentCancelPage;
