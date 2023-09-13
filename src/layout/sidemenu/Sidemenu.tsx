import React, { ReactNode } from "react";
import { useAuth } from "layout/navigation/AuthConText";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import "./css/Sidemenu.css";

type HeaderProps = {
  children?: ReactNode;
};

const Sidemenu: React.FC<HeaderProps> = ({ children }) => {
  const auth = useAuth();
  const navigate = useNavigate();

  return (
    <div className="sidebar-component">
      <div className="sidebar">
        <div>
          <Link to="/" className="home-logo">
            TTMARKET
          </Link>

          {/* 회원 관련 */}
          <div className="account-management">
            <p className="menu-name">
              <img className="menu-icon" alt="회원" src="img/account-icon.png" width={20} />
              Account
            </p>
            <div className="sub-menu">
              <div>
                <p
                  className="account-menu"
                  onClick={() => {
                    const userToken = localStorage.getItem("userToken");
                    if (
                      auth.checkAdminAuthorization() &&
                      userToken &&
                      userToken.includes("mainadmin")
                    ) {
                      navigate("/adminRegisterPage");
                    } else {
                      toast.error("권한이 없습니다.");
                    }
                  }}
                >
                  Admin
                </p>
                <p
                  className="account-menu"
                  onClick={() => {
                    navigate("/farmRegisterPage");
                  }}
                >
                  Farms
                </p>
                <p
                  className="account-menu"
                  onClick={() => {
                    navigate("/userListPage");
                  }}
                >
                  Users
                </p>
              </div>
            </div>
          </div>

          {/* 상품 관련 */}
          <div className="product-management">
            <p className="menu-name">
              <img className="menu-icon" alt="상품" src="img/farm-icon.png" width={20} />
              Product
            </p>
            <div className="sub-menu">
              <div>
                <p
                  className="product-menu"
                  onClick={() => {
                    navigate("/productRegisterPage");
                  }}
                >
                  Product Register
                </p>
                <p
                  className="product-menu"
                  onClick={() => {
                    navigate("/adminProductListPage");
                  }}
                >
                  Product List
                </p>
              </div>
            </div>
          </div>

          <div className="order-management">
            <p className="menu-name">
              <img className="menu-icon" alt="상품" src="img/farm-icon.png" width={20} />
              Order
            </p>
            <div className="sub-menu">
              <div>
                <p
                  className="order-menu"
                  onClick={() => {
                    navigate("/adminOrderListPage");
                  }}
                >
                  Order List
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="content-container">
        <div>{children}</div>
      </div>
    </div>
  );
};

export default Sidemenu;
