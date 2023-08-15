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
    <img
      className="oauth-login-btn"
      alt="카카오 로그인"
      src="img/KakaoLoginIcon.png"
      onClick={() => (window.location.href = kakaoURL)}
    />
  );
};

export default KakaoLogin;
