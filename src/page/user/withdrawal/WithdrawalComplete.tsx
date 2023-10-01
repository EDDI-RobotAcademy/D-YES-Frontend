import React, { useEffect } from "react";
import { Box, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useAuth } from "layout/navigation/AuthConText";
import { toast } from "react-toastify";

const WithdrawalComplete = () => {
  const navigate = useNavigate();
  const { checkAuthorization } = useAuth();
  const isUser = checkAuthorization();

  const goHome = () => {
    navigate("/");
  };

  useEffect(() => {
    if (!isUser) {
      toast.error("로그인을 해주세요.");
      navigate("/login");
    }
  }, [isUser, navigate]);
  
  return (
    <Box
      display="flex"
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
      minHeight="100vh"
    >
      <div className="exit-style">지금까지 투투마켓을 이용해주셔서 감사합니다.</div>
      <Button variant="outlined" onClick={goHome}>
        홈으로
      </Button>
    </Box>
  );
};

export default WithdrawalComplete;
