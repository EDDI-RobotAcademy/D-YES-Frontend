import React from "react";
import { createTheme, ThemeProvider } from "@mui/material";
import { AuthProvider } from "layout/navigation/AuthConText";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import ScrollToTop from "utility/ScrollToTop";
import MainPage from "page/MainPage";
import LoginPage from "oauth/LoginPage";
import MyPage from "page/user/myPage/MyPage";
import MyPageUpdate from "page/user/myPage/MyPageUpdate";
import WithdrawalPage from "page/user/withdrawal/WithdrawalPage";
import WithdrawalComplete from "page/user/withdrawal/WithdrawalComplete";
import ProductListPage from "page/product/ProductListPage";
import NewProductListPage from "page/product/NewProductListPage";
import ProductDetailPage from "page/product/ProductDetailPage";
import Cart from "page/cart/Cart";
import Order from "page/order/Order";
import AdminMainPage from "page/admin/AdminMainPage";
import AdminRegisterPage from "page/admin/adminPage/account/AdminRegisterPage";
import FarmRegisterPage from "page/admin/adminPage/farm/FarmRegisterPage";
import UserListPage from "page/admin/adminPage/account/UserListPage";
import ProductRegisterPage from "page/admin/adminPage/product/ProductRegisterPage";
import SnackBar from "layout/snackBar/SnackBar";
import TopButton from "utility/TopButton";
import { AdminLayout, UserLayout } from "Layout";
import AdminProductList from "page/admin/adminPage/product/AdminProductListPage";
import AdminProductModifyPage from "page/admin/adminPage/product/AdminProductModifyPage";
import AdminOrderListPage from "page/admin/adminPage/order/AdminOrderListPage";
import OrderCompletePage from "page/order/OrderCompletePage";
import MyOrderPage from "page/order/MyOrderPage";
import PaymentApprovalPage from "page/payment/kakao/PaymentApprovalPage";
import PaymentCancelPage from "page/payment/kakao/PaymentCancelPage";
import PaymentFailPage from "page/payment/kakao/PaymentFailPage";
import PaymentCompletePage from "page/payment/PaymentCompletePage";
import ReviewRegisterPage from "page/review/ReviewRegisterPage";
import AdminOrderReadPage from "page/admin/adminPage/order/AdminOrderReadPage";
import PaymentErrorPage from "page/payment/kakao/PaymentErrorPage";
import PaymentRefundPage from "page/payment/PaymentRefundPage";
import RecipeListPage from "page/recipe/RecipeListPage";
import RecipeDetailPage from "page/recipe/RecipeDetailPage";
import RecipeRegisterPage from "page/recipe/RecipeRegisterPage";
import RecipeReadPage from "page/recipe/RecipeReadPage";
import EventRegisterPage from "page/event/EventRegisterPage";
import AdminEventListPage from "page/event/AdminEventListPage";

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
            <Route element={<UserLayout />}>
              <Route path="/" element={<MainPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/myPage" element={<MyPage />} />
              <Route path="/updateInfo" element={<MyPageUpdate />} />
              <Route path="/withdrawal" element={<WithdrawalPage />} />
              <Route path="/exit" element={<WithdrawalComplete />} />
              <Route path="/productList/all" element={<ProductListPage />} />
              <Route path="/productList/new" element={<NewProductListPage />} />
              <Route path="/productList/category/:categoryName" element={<ProductListPage />} />
              <Route path="/productList/region/:region" element={<ProductListPage />} />
              <Route path="/productDetail/:productId" element={<ProductDetailPage />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/order" element={<Order />} />
              <Route path="/orderComplete" element={<OrderCompletePage />} />
              <Route path="/myOrder" element={<MyOrderPage />} />
              <Route path="/payment/kakao/approval" element={<PaymentApprovalPage />} />
              <Route path="/payment/kakao/cancel" element={<PaymentCancelPage />} />
              <Route path="/payment/kakao/fail" element={<PaymentFailPage />} />
              <Route path="/payment/kakao/error" element={<PaymentErrorPage />} />
              <Route path="/payment/complete" element={<PaymentCompletePage />} />
              <Route path="/payment/refund" element={<PaymentRefundPage />} />
              <Route path="/review/register" element={<ReviewRegisterPage />} />
              <Route path="/recipe/list" element={<RecipeListPage />} />
              <Route path="/recipe/detail/:id" element={<RecipeDetailPage />} />
              <Route path="/recipe/register" element={<RecipeRegisterPage />} />
            </Route>

            <Route element={<AdminLayout />}>
              <Route path="/adminMainPage" element={<AdminMainPage />} />
              <Route path="/adminRegisterPage" element={<AdminRegisterPage />} />
              <Route path="/farmRegisterPage" element={<FarmRegisterPage />} />
              <Route path="/userListPage" element={<UserListPage />} />
              <Route path="/productRegisterPage" element={<ProductRegisterPage />} />
              <Route path="/adminProductListPage" element={<AdminProductList />} />
              <Route
                path="/adminProductModifyPage/:productId"
                element={<AdminProductModifyPage />}
              />
              <Route path="/adminOrderListPage" element={<AdminOrderListPage />} />
              <Route
                path="/adminOrderListPage/orderReadPage/:productOrderId"
                element={<AdminOrderReadPage />}
              />
              <Route path="/adminEventRegister" element={<EventRegisterPage />} />
              <Route path="/adminEventList" element={<AdminEventListPage />} />
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
