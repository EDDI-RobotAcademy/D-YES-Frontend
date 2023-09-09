import { AuthProvider } from "layout/navigation/AuthConText";
import LoginPage from "oauth/LoginPage";
import MainPage from "page/MainPage";
import MyPage from "page/user/myPage/MyPage";
import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import SnackBar from "layout/snackBar/SnackBar";
import MyPageUpdate from "page/user/myPage/MyPageUpdate";
import WithdrawalPage from "page/user/withdrawal/WithdrawalPage";
import WithdrawalComplete from "page/user/withdrawal/WithdrawalComplete";
import AdminPage from "page/admin/AdminPage";
import NormalAdminRegister from "page/admin/adminPage/NormalAdminRegister";
import ProductRegisterPage from "page/product/productAdmin/ProductRegisterPage";
import ProductListPage from "page/product/productUser/ProductListPage";
import FarmRegisterPage from "./page/admin/adminPage/FarmRegisterPage";
import TopButton from "utility/TopButton";
import ProductDetail from "page/product/productUser/ProductDetail";
import Cart from "page/cart/Cart";
import { createTheme, ThemeProvider } from "@mui/material";
import Order from "page/order/Order";
import ScrollToTop from "utility/ScrollToTop";
import Layout from "Layout";

const theme = createTheme({
  typography: {
    fontFamily: "SUIT-SemiBold",
  },
});

const App: React.FC = () => {
  return (
    <AuthProvider>
      <ThemeProvider theme={theme}>
        <BrowserRouter>
          <ScrollToTop />
          <Routes>
            <Route element={<Layout />}>
              <Route path="/" element={<MainPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/myPage" element={<MyPage />} />
              <Route path="/updateInfo" element={<MyPageUpdate />} />
              <Route path="/withdrawal" element={<WithdrawalPage />} />
              <Route path="/exit" element={<WithdrawalComplete />} />
              <Route path="/productList/all" element={<ProductListPage />} />
              <Route path="/productList/category/:categoryName" element={<ProductListPage />} />
              <Route path="/productList/region/:region" element={<ProductListPage />} />
              <Route path="/productDetail/:productId" element={<ProductDetail />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/order" element={<Order />} />
            </Route>

            <Route>
              <Route path="/adminPage" element={<AdminPage />} />
              <Route path="/productRegister" element={<ProductRegisterPage />} />
              <Route path="/adminRegister" element={<NormalAdminRegister />} />
              <Route path="/farmRegister" element={<FarmRegisterPage />} />
            </Route>
          </Routes>
        </BrowserRouter>
        <SnackBar />
        <TopButton />
      </ThemeProvider>
    </AuthProvider>
  );
};

export default App;
