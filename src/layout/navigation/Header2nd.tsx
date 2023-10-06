import React, { ReactNode, useState } from "react";
import { Link } from "react-router-dom";
import MenuIcon from "@mui/icons-material/Menu";
import "./css/Header2nd.css";
import Header3rd from "./Header3rd";
import RestaurantIcon from "@mui/icons-material/Restaurant";

type HeaderProps = {
  children?: ReactNode;
};

const Header: React.FC<HeaderProps> = ({ children }) => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const showDrawer = () => {
    setIsDrawerOpen(!isDrawerOpen);
    console.log(isDrawerOpen);
  };

  const closeDrawer = () => {
    setIsDrawerOpen(false);
  };

  return (
    <div className="second-header-container">
      <div className="second-header-fontstyle">
        <div className="second-header-top-bar">
          <div className="second-header-btn-container-1">
            <div className="second-header-element" onClick={showDrawer}>
              <MenuIcon />
              <p>카테고리</p>
            </div>
          </div>
          {isDrawerOpen && (
            <div className="second-header-drawer">
              <Header3rd closeDrawer={closeDrawer} />
            </div>
          )}
          <div className="second-header-btn-container-2">
            <Link className="second-header-element" to={"/productList/all"}>
              <div style={{ minWidth: "60px", textAlign: "center" }}>
                <p>전체상품</p>
              </div>
            </Link>
            <Link className="second-header-element" to={"/productList/new"}>
              <div style={{ minWidth: "60px", textAlign: "center" }}>
                <p>신상품</p>
              </div>
            </Link>
            <Link className="second-header-element" to={"/event/list/all"}>
              <div style={{ minWidth: "60px", textAlign: "center" }}>
                <p>이벤트</p>
              </div>
            </Link>
          </div>
          <div className="second-header-btn-container-3">
            <Link className="second-header-element second-header-recipe-btn" to={"/recipe/list"}>
              <RestaurantIcon fontSize="small" />
              레시피
            </Link>
          </div>
        </div>
        {children}
      </div>
    </div>
  );
};

export default Header;
