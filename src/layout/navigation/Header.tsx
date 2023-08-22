import React, { ReactNode } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "./AuthConText";
import "./css/Header.css";
import { toast } from "react-toastify";
import { userLogout } from "page/user/api/UserApi";
import { AxiosError } from "axios";

type HeaderProps = {
  children?: ReactNode;
};

const Header: React.FC<HeaderProps> = ({ children }) => {
  const { isLoggedIn, setIsLoggedIn } = useAuth();
  // 로그아웃 동작
  const handleLogout = async () => {
    try {
      (await userLogout()) == true;
      localStorage.removeItem("userToken");
      // userToken이 제거되면 setIsLoggedIn이 false로 변경되어
      // 로그인 상태가 아니라는 것을 인식시킴
      // 따라서 헤더가 로그아웃 마이페이지에서 로그인으로 변경
      setIsLoggedIn(false);
      // 추출된 userToken을 삭제
      // 원래는 로컬에 저장된 userToken을 삭제해서 로그아웃을 진행하려했지만
      // 로그아웃을 해도 url에 userToken정보가 남아있어서 로그아웃이 진행되지않는 문제가 발생
      // url에서도 userToken을 제거해서 홈페이지 내부에 userToken의 정보를 남기지않게 만듬
      const urlSearchParams = new URLSearchParams(window.location.search);
      urlSearchParams.delete("userToken");
      window.history.replaceState(
        {},
        document.title,
        `${window.location.pathname}?${urlSearchParams.toString()}`
      );
      toast.success("로그아웃했습니다.");
      window.location.href = "/";
    } catch (error) {
      if ((error as AxiosError).response && (error as AxiosError).response?.status === 400) {
        toast.error("페이지를 찾을 수 없습니다.");
      } else {
        toast.error("서버와 통신 중 오류가 발생했습니다.");
      }
    }
  };

  return (
    <div className="header-fontstyle">
      <div className="top-bar">
        <Link className="Home" to={"/"}>
          TTMARKET
        </Link>
        {isLoggedIn ? (
          <>
            <Link className="MyPage" to={"/myPage"}>
              <p>마이페이지</p>
              {/* <img src="img/MyPage.png" alt="마이페이지" /> */}
            </Link>
            <button className="Menu-logout" onClick={handleLogout}>
              <p>로그아웃</p>
              {/* <img src="img/Logout.png" alt="로그아웃" /> */}
            </button>
            <Link className="register" to={"/productPage"}>
              <p>관리자 페이지</p>
            </Link>
          </>
        ) : (
          <>
            <Link className="Login" to={"/login"}>
              <p>로그인</p>
              {/* <img src="img/Login.png" alt="로그인" /> */}
            </Link>
          </>
        )}
      </div>
      {children}
    </div>
  );
};
export default Header;