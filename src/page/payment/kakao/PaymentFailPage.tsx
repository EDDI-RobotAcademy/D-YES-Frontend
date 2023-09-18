import React from "react";
import { Button } from "@mui/material";
import { useNavigate } from "react-router-dom";

import "../css/PaymentFail.css";

const PaymentFailPage: React.FC = () => {
  const navigate = useNavigate();

  const goHome = () => {
    navigate("/");
  };

  return (
    <div>
      <div className="payment-fail">
        <div className="payment-fail-name">결제에 실패했습니다</div>
        <Button size="large" variant="outlined" onClick={goHome}>
          메인으로
        </Button>
      </div>
    </div>
  );
};

export default PaymentFailPage;
