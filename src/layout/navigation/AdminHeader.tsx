import React from "react";
import "./css/AdminHeader.css";
import { useLocation } from "react-router-dom";

function AdminHeader() {
  const location = useLocation();
  const path = location.pathname;

  const getPageText = () => {
    switch (path) {
      case "/userListPage":
        return "| 유저 목록";
      case "/adminMainPage":
        return "| 어드민 메인 페이지";
      case "/adminRegisterPage":
        return "| 관리자 등록";
      case "/farmRegisterPage":
        return "| 농가 등록";
      case "/productRegisterPage":
        return "| 상품 등록";
      case "/adminProductListPage":
        return "| 상품 목록";
      case "/adminProductModifyPage":
        return "| 상품 수정";
      case "/adminOrderListPage":
        return "| 주문 목록";
      case "/adminOrderListPage/orderReadPage":
        return "| 주문 상세 내역";
      case "/adminEventRegister":
        return "| 이벤트 상품 등록";
      case "/adminEventList":
        return "| 이벤트 상품 목록";
      case "/adminInquiryListPage":
        return "| 1:1 문의 목록";
      default:
        return "";
    }
  };

  return (
    <div className="admin-header-container">
      <div className="menu">{getPageText()}</div>
    </div>
  );
}

export default AdminHeader;
