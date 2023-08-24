import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
// import "../product/productAdmin/css/ProductPage.css";
import "./adminPage/css/AdminPage.css";
import NormalAdminRegister from "./adminPage/NormalAdminRegister";
import ProductRegisterPage from "page/product/productAdmin/ProductRegisterPage";

interface ProductPageProps {
  setShowHeader: React.Dispatch<React.SetStateAction<boolean>>;
  setShowFooter: React.Dispatch<React.SetStateAction<boolean>>;
}

const AdminPage: React.FC<ProductPageProps> = ({ setShowHeader, setShowFooter }) => {
  const [showProductSection, setShowProductSection] = useState("register"); // "register" or "list"

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
          <h2 className="logo">TTMARKET</h2>
          <div className={`product-management ${showProductSection ? "active" : ""}`}>
            회원 관리
            <div className={`sub-menu ${showProductSection ? "show" : ""}`}>
              <div>
                <Link to="#" onClick={() => setShowProductSection("adminRegister")}>
                  - 관리자 등록
                </Link>
              </div>
            </div>
          </div>
          <div className={`product-management ${showProductSection ? "active" : ""}`}>
            상품관리
            <div className={`sub-menu ${showProductSection ? "show" : ""}`}>
              <div>
                <Link to="#" onClick={() => setShowProductSection("register")}>
                  - 상품 등록
                </Link>
              </div>
              <div>
                <Link to="#" className="list-button" onClick={() => setShowProductSection("list")}>
                  - 상품 조회
                </Link>
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
          <div className="adminRegister-inner">
            {showProductSection === "adminRegister" && <NormalAdminRegister />}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPage;
