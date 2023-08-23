import "../css/loginButton.css";

interface KakaoLoginProps {
  onSuccess: () => void;
}

const KakaoLogin: React.FC<KakaoLoginProps> = ({ onSuccess }) => {
  const CLIENT_ID = `${process.env.REACT_APP_KAKAO_REST_API_KEY}`;
  const REDIRECT_URI = `${process.env.REACT_APP_KAKAO_REDIRECT_URL}`;
  const kakaoURL =
    "https://kauth.kakao.com/oauth/authorize?" +
    `client_id=${CLIENT_ID}&` +
    `redirect_uri=${REDIRECT_URI}&` +
    "response_type=code";

  return (
  <div className="oauth-login-btn-container" onClick={() => (window.location.href = kakaoURL)}>
    <img
      className="oauth-login-btn"
      alt="카카오 로그인"
      src="img/KakaoLoginIcon1.png"
    />
    <p className="oauth-login-text">카카오 로그인</p>
  </div>
  );
};

export default KakaoLogin;
