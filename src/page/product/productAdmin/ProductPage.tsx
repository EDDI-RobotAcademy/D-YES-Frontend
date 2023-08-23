import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./css/ProductPage.css";
import ProductRegisterPage from "./ProductRegisterPage"; // 상품 등록 페이지 컴포넌트 임포트

interface ProductPageProps {
  setShowHeader: React.Dispatch<React.SetStateAction<boolean>>;
  setShowFooter: React.Dispatch<React.SetStateAction<boolean>>;
}

const ProductPage: React.FC<ProductPageProps> = ({ setShowHeader, setShowFooter }) => {
  const [showProductSection, setShowProductSection] = useState(true);

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
      <div className={`sidebar ${showProductSection ? "" : "collapsed"}`}>
        <div>
          <h2 className="logo">TTMARKET</h2>
          <div className={`product-management ${showProductSection ? "active" : ""}`}>
            상품관리
            <div className={`sub-menu ${showProductSection ? "show" : ""}`}>
              <div>
                <Link to="#" onClick={() => setShowProductSection(!showProductSection)}>
                  - 상품 등록
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className={`content ${showProductSection ? "expanded" : ""}`}>
        {/* showProductSection 값에 따라 상품 등록 페이지 렌더링 */}
        <div className="content-inner">{showProductSection && <ProductRegisterPage />}</div>
      </div>
    </div>
  );
};

export default ProductPage;
