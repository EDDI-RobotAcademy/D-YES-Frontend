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
          <div className="second-header-btn-container">
            <Link className="second-header-link" to={"/productList/all"}>
              <MenuIcon />
              <p>카테고리</p>
            </Link>
          </div>
          <div className="second-header-btn-container">
            <Link className="second-header-link" to={"/"}>
              신상품
            </Link>
            <Link className="second-header-link" to={"/"}>
              베스트
            </Link>
            <Link className="second-header-link" to={"/"}>
              이벤트
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
