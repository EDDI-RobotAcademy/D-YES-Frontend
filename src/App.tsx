import Footer from "layout/footer/Footer";
import { AuthProvider } from "layout/navigation/AuthConText";
import Header from "layout/navigation/Header";
import LoginPage from "oauth/LoginPage";
import MainPage from "page/MainPage";
import MyPage from "page/user/myPage/MyPage";
import React, { useState } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import SnackBar from "layout/snackBar/SnackBar";
import MyPageUpdate from "page/user/myPage/MyPageUpdate";
import WithdrawalPage from "page/user/withdrawal/WithdrawalPage";
import WithdrawalComplete from "page/user/withdrawal/WithdrawalComplete";
import AdminPage from "page/admin/AdminPage";
import NormalAdminRegister from "page/admin/adminPage/NormalAdminRegister";
import ProductRegisterPage from "page/product/productAdmin/ProductRegisterPage";
import ProductListPage from "page/product/productUser/ProductListPage";
import AdminProductList from "page/product/productAdmin/AdminProductList";
import FarmRegisterPage from "./page/admin/adminPage/FarmRegisterPage";
import TopButton from "utility/TopButton";
import AdminProductModifyPage from "page/product/productAdmin/AdminProductModifyPage";

const App: React.FC = () => {
  const [showHeader, setShowHeader] = useState(true);
  const [showFooter, setShowFooter] = useState(true);

  return (
    <AuthProvider>
      <BrowserRouter>
        {showHeader && <Header />}
        <Routes>
          <Route path="/" element={<MainPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/myPage" element={<MyPage />} />
          <Route path="/updateInfo" element={<MyPageUpdate />} />
          <Route path="/withdrawal" element={<WithdrawalPage />} />
          <Route path="/exit" element={<WithdrawalComplete />} />
          <Route path="/productList" element={<ProductListPage />} />
          <Route
            path="/adminPage"
            element={<AdminPage setShowHeader={setShowHeader} setShowFooter={setShowFooter} />}
          />
          <Route path="/productRegister" element={<ProductRegisterPage />} />
          <Route path="/adminProductList" element={<AdminProductList />} />
          <Route path="/adminRegister" element={<NormalAdminRegister />} />
          <Route path="/farmRegister" element={<FarmRegisterPage />} />
          <Route path="/adminPage/productModify/:productId" element={<AdminProductModifyPage />} />
        </Routes>
        {showFooter && <Footer />}
      </BrowserRouter>
      <SnackBar />
      <TopButton />
    </AuthProvider>
  );
};

export default App;
