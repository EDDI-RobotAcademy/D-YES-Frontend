import React, { ReactNode } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from './AuthConText';
import './css/Header.css'

type HeaderProps = {
  children?: ReactNode;
};

const Header: React.FC<HeaderProps> = ({ children }) => {
  const navigate = useNavigate();
  const { isLoggedIn, setIsLoggedIn } = useAuth();

  const handleLogout = () => {

  };

  return (
    <div>
      <div className='top-bar'>
        <div className='menu-container'>
        <Link className='Menu' to={'/'}>home</Link>
          {isLoggedIn ? (
            <>
              <button className='Menu-logout' onClick={handleLogout}>로그아웃</button>
              <Link className='Menu' to={'/myPage'}>마이페이지</Link>
            </>
          ) : (
            <>
              <Link className='Menu' to={'/login'}>로그인</Link>
              <Link className='Menu' to={'/signup'}>회원가입</Link>
            </>
          )}
        </div>
      </div>
      {children}
    </div>
  );
};

export default Header;