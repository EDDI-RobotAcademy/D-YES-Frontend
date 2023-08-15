import { Box, Container } from "@mui/material";

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
      </Container>
    </Box>
  );
};

export default LoginPage;
