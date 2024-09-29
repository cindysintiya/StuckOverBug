import { createContext, useEffect, useState } from "react";

import { emptyUser } from "../utils/DataUsers";

const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
  const [isLogin, setIsLogin] = useState(false);
  const [loginData, setLoginData] = useState(emptyUser);

  useEffect(() => {
    const token = sessionStorage.getItem("token");

    if (token) {
      setIsLogin(true);
      setLoginData(JSON.parse(token));      
    }
  }, []);

  return (
    <AuthContext.Provider value={{ isLogin, setIsLogin, loginData, setLoginData, }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
