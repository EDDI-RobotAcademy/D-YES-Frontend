import React, { createContext, useCallback, useContext, useEffect, useState } from "react";

type AuthContextType = {
  isLoggedIn: boolean;
  setIsLoggedIn: (isLoggedIn: boolean) => void;
  // 인증상태를 확인하여 로그인이 되어있으면 true로 동작
  // 로그인이 안되어있으면 로그인 페이지로 이동시킬 수 있음
  // 이 설정을 하고싶으면 해당 페이지에서 설정해줘야함
  checkAuthorization: () => boolean;
  checkAdminAuthorization: () => boolean;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const checkAuthorization = useCallback((): boolean => {
    const userToken = localStorage.getItem("userToken");
    return !!userToken; // 로그인이 안 된 경우
  }, []);

  const checkAdminAuthorization = useCallback((): boolean => {
    const userToken = localStorage.getItem("userToken");
    return !!userToken && (userToken.includes("mainadmin") || userToken.includes("normaladmin"));
  }, []);
  const saveTokenFromUrl = useCallback(() => {
    // url에서 userToken추출
    const urlSearchParams = new URLSearchParams(window.location.search);
    const userToken = urlSearchParams.get("userToken");

    if (userToken) {
      localStorage.setItem("userToken", userToken);
      setIsLoggedIn(true);

      // 로그인 성공 후 홈페이지로 리다이렉트
      window.location.href = "/";
    }
  }, []);

  // 이게 있어야 로그인상태를 유지시킴
  useEffect(() => {
    setIsLoggedIn(checkAuthorization());
    saveTokenFromUrl();
  }, [checkAuthorization, saveTokenFromUrl]);

  return (
    <AuthContext.Provider value={{ isLoggedIn, setIsLoggedIn, checkAuthorization, checkAdminAuthorization }}>
      {children}
    </AuthContext.Provider>
  );
};

// useAuth 함수는 AuthContext 의 값을 가져오기 위한 커스텀 훅
// AuthProvider 밖에서 useAuth를 사용하려고 할 때 에러를 던지는데
// 이미 전역으로 설정되어있기 때문에 해당 오류는 발생하지 않을 것임
export const useAuth = (): AuthContextType => {
  const auth = useContext(AuthContext);
  if (!auth) {
    throw new Error("AuthProvider밖에서 사용할 수 없습니다.");
  }
  return auth;
};
