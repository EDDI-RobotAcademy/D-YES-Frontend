import React, { useEffect } from "react";
import { Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { kakaoPaymentRejectRequest } from "../api/PaymentApi";
import { toast } from "react-toastify";

import "../css/PaymentFail.css";

const PaymentErrorPage: React.FC = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPaymentData = async () => {
      try {
        const data = await kakaoPaymentRejectRequest();
        if (data) {
          toast.error("결제에 실패했습니다");
        } else {
          toast.error("오류가 발생했습니다");
        }
      } catch (error) {
        toast.error("오류가 발생했습니다");
      }
    };
    fetchPaymentData();
  }, []);

  const goHome = () => {
    navigate("/");
  };

  const goCart = () => {
    navigate("/cart");
  };

  return (
    <div>
      <div className="payment-fail">
        <div className="payment-fail-name">결제에 실패했습니다</div>
        <div>
          <Button size="large" variant="outlined" onClick={goHome}>
            메인으로
          </Button>
          <Button size="large" variant="outlined" style={{ marginLeft: "3px" }} onClick={goCart}>
            장바구니로 돌아가기
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PaymentErrorPage;
