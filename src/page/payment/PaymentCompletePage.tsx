import React from "react";
import { Button } from "@mui/material";
import { useNavigate } from "react-router-dom";

import "./css/PaymentComplete.css";

const PaymentCompletePage: React.FC = () => {
  const navigate = useNavigate();

  const goToProductList = () => {
    navigate("/productList/all");
  };

  return (
    <div>
      <div className="payment-complete">
        <div className="payment-complete-name">결제가 완료되었습니다</div>
        <Button size="large" variant="outlined" onClick={goToProductList}>
          쇼핑 계속하기
        </Button>
      </div>
    </div>
  );
};

export default PaymentCompletePage;
