import React, { ReactNode, useState } from "react";
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
  const [activeMenus, setActiveMenus] = useState<string[]>([]);

  const handleMenuClick = (menuName: string) => {
    setActiveMenus((prevActiveMenus) => {
      if (prevActiveMenus.includes(menuName)) {
        return prevActiveMenus.filter((item) => item !== menuName);
      } else {
        return [...prevActiveMenus, menuName];
      }
    });
  };

  const isMenuActive = (menuName: string) => activeMenus.includes(menuName);

  return (
    <div className="sidebar-component">
      <div className="sidebar">
        <div>
          <Link to="/" className="home-logo">
            TTMARKET
          </Link>

          <div className="dash-board">
            <p
              className="menu-name"
              onClick={() => {
                navigate("/adminMainPage");
              }}
            >
              <img className="menu-icon" alt="상품" src="img/dash-board-icon.png" width={18} />
              대쉬보드
            </p>
          </div>

          {/* 회원 관련 */}
          <div className="account-management">
            <p className="menu-name">
              <img className="menu-icon" alt="회원" src="img/account-icon.png" width={18} />
              회원관리
              <img
                className="btn-icon"
                src="/img/drop-down-btn.png"
                alt=""
                onClick={() => handleMenuClick("account")}
                style={{ width: "20px", alignSelf: "center" }}
              />
            </p>
            {isMenuActive("account") && (
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
                    관리자 등록
                  </p>
                  <p
                    className="account-menu"
                    onClick={() => {
                      navigate("/farmRegisterPage");
                    }}
                  >
                    농가 목록
                  </p>
                  <p
                    className="account-menu"
                    onClick={() => {
                      navigate("/userListPage");
                    }}
                  >
                    회원 목록
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* 상품 관련 */}
          <div className="product-management">
            <p className="menu-name">
              <img className="menu-icon" alt="상품" src="img/product-icon.png" width={18} />
              상품관리
              <img
                className="btn-icon"
                src="/img/drop-down-btn.png"
                alt=""
                onClick={() => handleMenuClick("product")}
                style={{ width: "20px", alignSelf: "center" }}
              />
            </p>
            {isMenuActive("product") && (
              <div className="sub-menu">
                <div>
                  <p
                    className="product-menu"
                    onClick={() => {
                      navigate("/productRegisterPage");
                    }}
                  >
                    상품 등록
                  </p>
                  <p
                    className="product-menu"
                    onClick={() => {
                      navigate("/adminProductListPage");
                    }}
                  >
                    상품 목록
                  </p>
                  <p
                    className="product-menu"
                    onClick={() => {
                      navigate("/adminEventRegister");
                    }}
                  >
                    이벤트 등록
                  </p>
                </div>
              </div>
            )}
          </div>

          <div className="order-management">
            <p className="menu-name">
              <img className="menu-icon" alt="상품" src="img/order-icon.png" width={18} />
              주문관리
              <img
                className="btn-icon"
                src="/img/drop-down-btn.png"
                alt=""
                onClick={() => handleMenuClick("order")}
                style={{ width: "20px", alignSelf: "center" }}
              />
            </p>
            {isMenuActive("order") && (
              <div className="sub-menu">
                <div>
                  <p
                    className="order-menu"
                    onClick={() => {
                      navigate("/adminOrderListPage");
                    }}
                  >
                    주문 목록
                  </p>
                </div>
              </div>
            )}
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
