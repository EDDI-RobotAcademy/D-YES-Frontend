import React, { createContext, useCallback, useContext, useEffect, useState } from "react";

type AuthContextType = {
  isLoggedIn: boolean;
  setIsLoggedIn: (isLoggedIn: boolean) => void;
  checkAuthorization: () => boolean;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const checkAuthorization = useCallback((): boolean => {
    const userToken = localStorage.getItem("userToken");
    return !!userToken;
  }, []);
  
  const saveTokenFromUrl = useCallback(() => {
    const urlSearchParams = new URLSearchParams(window.location.search);
    const userToken = urlSearchParams.get('userToken');

    if (userToken) {
      localStorage.setItem('userToken', userToken);
      setIsLoggedIn(true);
    }
  }, []);

  useEffect(() => {
    setIsLoggedIn(checkAuthorization());
    saveTokenFromUrl();
  }, [checkAuthorization, saveTokenFromUrl]);

  return (
    <AuthContext.Provider value={{ isLoggedIn, setIsLoggedIn, checkAuthorization }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const auth = useContext(AuthContext);
  if (!auth) {
    throw new Error("AuthProvider밖에서 사용할 수 없습니다.");
  }
  return auth;
};
