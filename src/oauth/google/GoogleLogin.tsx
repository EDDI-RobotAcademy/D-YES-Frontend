import "../css/loginButton.css";

interface googleLoginProps {
  onSuccess: () => void;
}

const GoogleLoginButton: React.FC<googleLoginProps> = ({ onSuccess }) => {
  const CLIENT_ID = `${process.env.REACT_APP_GOOGLE_AUTH_CLIENT_ID}`;
  const REDIRECT_URI = `${process.env.REACT_APP_GOOGLE_REDIRECT_URL}`;
  const googleURL =
    "https://accounts.google.com/o/oauth2/v2/auth?" +
    "scope=https://www.googleapis.com/auth/userinfo.profile" +
    "+https://www.googleapis.com/auth/userinfo.email&" +
    "response_type=code&" +
    `redirect_uri=${REDIRECT_URI}&` +
    `client_id=${CLIENT_ID}&` +
    "access_type=offline";

  return (
    <div className="oauth-login-btn-container" onClick={() => (window.location.href = googleURL)}>
      <img
        className="oauth-login-btn"
        alt="구글 로그인"
        src="img/GoogleLoginIcon1.png"
      />
      <p className="oauth-login-text">구글 로그인</p>
    </div>
  );
};

export default GoogleLoginButton;
