import React, { ReactNode, useState } from "react";
import { Link } from "react-router-dom";
import MenuIcon from "@mui/icons-material/Menu";
import "./css/Header2nd.css";
import Header3rd from "./Header3rd";

type HeaderProps = {
  children?: ReactNode;
};

const Header: React.FC<HeaderProps> = ({ children }) => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const handleMouseEnter = () => {
    setIsDrawerOpen(true);
  };

  const handleMouseLeave = () => {
    setIsDrawerOpen(false);
  };

  return (
    <div className="second-header-container">
      <div className="second-header-fontstyle">
        <div
          className={`second-header-top-bar ${isDrawerOpen ? "drawer-open" : ""}`}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          <div className="second-header-btn-container-1">
            <Link className="second-header-link" to={"/productList/all"}>
              <MenuIcon />
              <div><p>카테고리</p></div>
            </Link>
          </div>
          <div className="second-header-btn-container-2">
            <Link className="second-header-link" to={"/"}>
            <div style={{ minWidth: "60px", textAlign: "center" }}><p>신상품</p></div>
            </Link>
            <Link className="second-header-link" to={"/"}>
            <div style={{ minWidth: "60px", textAlign: "center" }}><p>베스트</p></div>
            </Link>
            <Link className="second-header-link" to={"/"}>
            <div style={{ minWidth: "60px", textAlign: "center" }}><p>이벤트</p></div>
            </Link>
          </div>
          <div className={`second-header-drawer ${isDrawerOpen ? "drawer-open" : ""}`}>
            <Header3rd />
          </div>
        </div>
        {children}
      </div>
    </div>
  );
};

export default Header;
