import React, { useEffect } from "react";
import { useAuth } from "layout/navigation/AuthConText";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const OrderCompletePage = () => {
  const navigate = useNavigate();
  const { checkAuthorization } = useAuth();
  const isUser = checkAuthorization();

  useEffect(() => {
    if (!isUser) {
      toast.error("로그인을 해주세요.");
      navigate("/login");
    }
  }, [isUser, navigate]);

  return <div>주문 성공 페이지</div>;
};

export default OrderCompletePage;
