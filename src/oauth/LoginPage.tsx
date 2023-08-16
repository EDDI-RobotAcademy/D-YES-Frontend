import { Box, Container } from "@mui/material";
import KakaoLogin from "oauth/kakao/KakaoLogin";
import GoogleLogin from "oauth/google/GoogleLogin";
import NaverLogin from "oauth/naver/NaverLogin";

import "./css/loginPage.css";
import { useAuth } from "layout/navigation/AuthConText";

const LoginPage = () => {
  const { setIsLoggedIn } = useAuth();

  const handleLoginSuccess = () => {
    setIsLoggedIn(true);
  };

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
          <KakaoLogin onSuccess={handleLoginSuccess} />
          <GoogleLogin onSuccess={handleLoginSuccess} />
          <NaverLogin onSuccess={handleLoginSuccess} />
        </div>
      </Container>
    </Box>
  );
};

export default LoginPage;
