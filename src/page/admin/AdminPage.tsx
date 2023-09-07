import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./adminPage/css/AdminPage.css";
import NormalAdminRegister from "./adminPage/NormalAdminRegister";
import ProductRegisterPage from "page/product/productAdmin/ProductRegisterPage";
import { useAuth } from "layout/navigation/AuthConText";
import { toast } from "react-toastify";
import AdminProductList from "page/product/productAdmin/AdminProductList";
import FarmRegisterPage from "./adminPage/FarmRegisterPage";
import AdminProductModifyPage from "page/product/productAdmin/AdminProductModifyPage";
import UserListPage from "./adminPage/UserListPage";

interface ProductPageProps {
  setShowHeader: React.Dispatch<React.SetStateAction<boolean>>;
  setShowFooter: React.Dispatch<React.SetStateAction<boolean>>;
}

const AdminPage: React.FC<ProductPageProps> = ({ setShowHeader, setShowFooter }) => {
  const [showProductSection, setShowProductSection] = useState("register");
  const auth = useAuth();

  useEffect(() => {
    // 마운트되었을 때 Header를 숨기도록 설정
    setShowHeader(false);
    setShowFooter(false);

    return () => {
      // 컴포넌트 언마운트 시에 Header를 다시 보이도록 설정
      setShowHeader(true);
      setShowFooter(true);
    };
  }, [setShowHeader, setShowFooter]);

  return (
    <div className="product-page">
      <div className={`sidebar ${showProductSection === "register" ? "" : "collapsed"}`}>
        <div>
          <Link to="/" className="home-logo">
            TTMARKET
          </Link>

          {/* 회원 관련 */}
          <div className={`product-management ${showProductSection ? "active" : ""}`}>
            <p className="menu-name">
              <img className="menu-icon" alt="회원" src="img/account-icon.png" width={20} />
              Account
            </p>
            <div className={`sub-menu ${showProductSection ? "show" : ""}`}>
              <div>
                <div className="account-menu">
                  <Link
                    to="#"
                    onClick={() => {
                      const userToken = localStorage.getItem("userToken");
                      if (
                        auth.checkAdminAuthorization() &&
                        userToken &&
                        userToken.includes("mainadmin")
                      ) {
                        setShowProductSection("adminRegister");
                      } else {
                        toast.error("권한이 없습니다.");
                      }
                    }}
                  >
                    <p className="account-menu">Admin</p>
                  </Link>
                </div>
                <div className="account-menu">
                  <Link
                    to="#"
                    className="list-button"
                    onClick={() => setShowProductSection("farmRegister")}
                  >
                    <p className="account-menu">Farms</p>
                  </Link>
                </div>
                <div className="account-menu">
                  <Link
                    to="#"
                    className="list-button"
                    onClick={() => setShowProductSection("userList")}
                  >
                    <p className="account-menu">Users</p>
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* 상품 관련 */}
          <div className={`product-management ${showProductSection ? "active" : ""}`}>
            <p className="menu-name">
              <img className="menu-icon" alt="상품" src="img/farm-icon.png" width={20} />
              Product
            </p>
            <div className={`sub-menu ${showProductSection ? "show" : ""}`}>
              <div>
                <div className="product-menu">
                  <Link to="#" onClick={() => setShowProductSection("register")}>
                    <p className="product-menu">Product Register</p>
                  </Link>
                </div>
                <div className="product-menu">
                  <Link
                    to="#"
                    className="list-button"
                    onClick={() => setShowProductSection("list")}
                  >
                    <p className="product-menu">Product List</p>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className={`content ${showProductSection === "register" ? "expanded" : ""}`}>
        <div>
          <div className="register-inner">
            {showProductSection === "register" && <ProductRegisterPage />}
          </div>
          <div className="list-inner">
            {showProductSection === "list" && (
              <AdminProductList setShowProductSection={setShowProductSection} />
            )}
          </div>
          <div className="adminRegister-inner">
            {showProductSection === "adminRegister" && <NormalAdminRegister />}
          </div>
          <div className="farmRegister-inner">
            {showProductSection === "farmRegister" && <FarmRegisterPage />}
          </div>
          <div className={`farmModify-inner`}>
            {showProductSection.startsWith("productModify/") && (
              <AdminProductModifyPage productId={showProductSection.substring(14)} />
            )}
          </div>
          <div className="user-inner">
            {showProductSection === "userList" && <UserListPage />}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPage;
