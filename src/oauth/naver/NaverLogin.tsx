import { getImageUrl } from "utility/s3/awsS3";

import "../css/loginButton.css";

interface naverLoginProps {
  onSuccess: () => void;
}

const NaverLogin: React.FC<naverLoginProps> = ({ onSuccess }) => {
  const CLIENT_ID = `${process.env.REACT_APP_NAVER_AUTH_CLIENT_ID}`;
  const REDIRECT_URI = `${process.env.REACT_APP_NAVER_REDIRECT_URL}`;
  const STATE: string = Math.random().toString(36).slice(2, 16);
  const naverURL =
    "https://nid.naver.com/oauth2.0/authorize?" +
    "response_type=code&" +
    `client_id=${CLIENT_ID}&` +
    `state=${STATE}&` +
    `redirect_uri=${REDIRECT_URI}`;

  return (
    <div className="oauth-login-btn-container" onClick={() => (window.location.href = naverURL)}>
      <img
        className="oauth-login-btn"
        alt="네이버 로그인"
        src={getImageUrl("resources/NaverLoginIcon.png")}
      />
      <p className="oauth-login-text">네이버 로그인</p>
    </div>
  );
};

export default NaverLogin;
