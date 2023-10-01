import React, { useEffect } from "react";
import { Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useAuth } from "layout/navigation/AuthConText";

import "./css/PaymentComplete.css";

const PaymentCompletePage: React.FC = () => {
  const navigate = useNavigate();
  const { checkAuthorization } = useAuth();
  const isUser = checkAuthorization();

  const goToProductList = () => {
    navigate("/productList/all");
  };

  useEffect(() => {
    if (!isUser) {
      toast.error("로그인을 해주세요.");
      navigate("/login");
    }
  }, [isUser, navigate]);

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
