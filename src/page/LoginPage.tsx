import { Box, Container } from "@mui/material";
import KakaoLogin from "oauth/kakao/KakaoLogin";

import "./css/loginPage.css";

const LoginPage = () => {
  return (
    <Box
      display="flex"
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
      minHeight="100vh"
    >
      <Container maxWidth="xs">
        <div className="login-header">로그인·회원가입</div>
        <div className="login-icons">
          <KakaoLogin />
        </div>
      </Container>
    </Box>
  );
};

export default LoginPage;
