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
        <Link className='Home' to={'/'}>TOTO마켓</Link>
          {isLoggedIn ? (
            <>
              <Link className='MyPage' to={'/myPage'}>
              <img src='img/MyPage.png' alt='마이페이지' />
              </Link>
              <button className='Menu-logout' onClick={handleLogout}>
                <img src='img/Logout.png' alt='로그아웃' />
              </button>
            </>
          ) : (
            <>
              <Link className='Login' to={'/login'}>
                <img src='img/Login.png' alt='로그인' />
              </Link>
            </>
          )}
      </div>
      {children}
    </div>
  );
};

export default Header;