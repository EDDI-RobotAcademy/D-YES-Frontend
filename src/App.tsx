import Footer from "layout/footer/Footer";
import { AuthProvider } from "layout/navigation/AuthConText";
import Header from "layout/navigation/Header";
import LoginPage from "oauth/LoginPage";
import MainPage from "page/MainPage";
import MyPage from "page/user/myPage/MyPage";
import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";

const App: React.FC = () => {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Header />
        <Routes>
          <Route path="/" element={<MainPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/myPage" element={<MyPage />} />
        </Routes>
        <Footer />
      </BrowserRouter>
    </AuthProvider>
  );
};

export default App;