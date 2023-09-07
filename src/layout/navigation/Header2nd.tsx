import React, { ReactNode, useState } from "react";
import { Link } from "react-router-dom";
import MenuIcon from "@mui/icons-material/Menu";
import "./css/Header2nd.css";

type HeaderProps = {
  children?: ReactNode;
};

const Header: React.FC<HeaderProps> = ({ children }) => {
  return (
    <div className="second-header-container">
      <div className="second-header-fontstyle">
        <div className={"second-header-top-bar"}>
          <div className="second-header-btn-container">
            <Link className="second-header-link" to={"/productList"}>
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
        </div>
      </div>
      {children}
    </div>
  );
};

export default Header;
