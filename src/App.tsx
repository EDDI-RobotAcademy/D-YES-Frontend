import Footer from "layout/footer/Footer";
import { AuthProvider } from "layout/navigation/AuthConText";
import Header from "layout/navigation/Header";
import LoginPage from "oauth/LoginPage";
import MainPage from "page/MainPage";
import MyPage from "page/user/myPage/MyPage";
import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import SnackBar from "layout/snackBar/SnackBar";
import MyPageUpdate from "page/user/myPage/MyPageUpdate";
import WithdrawalPage from "page/user/withdrawal/WithdrawalPage";
import WithdrawalComplete from "page/user/withdrawal/WithdrawalComplete";

const App: React.FC = () => {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Header />
        <Routes>
          <Route path="/" element={<MainPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/myPage" element={<MyPage />} />
          <Route path="/updateInfo" element={<MyPageUpdate />} />
          <Route path="/withdrawal" element={<WithdrawalPage />} />
          <Route path="/exit" element={<WithdrawalComplete />} />
        </Routes>
        <Footer />
      </BrowserRouter>
      <SnackBar />
    </AuthProvider>
  );
};

export default App;
