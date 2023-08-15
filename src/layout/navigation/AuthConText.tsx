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
    const accessToken = localStorage.getItem("accessToken");
    return !!accessToken;
  }, []);

  useEffect(() => {
    setIsLoggedIn(checkAuthorization());
  }, [checkAuthorization]);

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
