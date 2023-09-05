import React, { ReactNode } from "react";
import { Link } from "react-router-dom";
import MenuIcon from '@mui/icons-material/Menu';
import "./css/Header2nd.css";

type HeaderProps = {
  children?: ReactNode;
};

const Header: React.FC<HeaderProps> = ({ children }) => {
  return (
    <div className="second-header-fontstyle">
      <div className="second-top-bar">
        <div className="top-bar-left">
          <Link className="go-to-catagory"style={{ display: 'flex', alignItems: 'center' }}  to={"/productList"}>
            <MenuIcon />
            <p style={{ marginLeft: '5px' }}>카테고리</p>
          </Link>
        </div>
        <div className="top-bar-right">
          <Link className="go-to-new" to={"/"}>
            신상품
          </Link>
          <Link className="go-to-best" to={"/"}>
            베스트
          </Link>
          <Link className="go-to-event" to={"/"}>
            이벤트
          </Link>
        </div>
      </div>
      {children}
    </div>
  );
};

export default Header;
