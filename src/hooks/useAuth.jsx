import { useContext } from "react";
import AuthContext from "../contexts/AuthProvider";

import { emptyUser } from "../utils/format";

const useLogout = () => {
  const { setIsLogin, setLoginData } = useContext(AuthContext);

  const logout = () => {
    setIsLogin(false);
    setLoginData(emptyUser);
    
    sessionStorage.clear();
  };

  return logout;
};

const useLogin = () => {
  const { setIsLogin, setLoginData } = useContext(AuthContext);

  const login = (data) => {    
    setIsLogin(true);
    setLoginData(data);
    
    sessionStorage.setItem("token", JSON.stringify(data));
  };

  return login;
};

const useRegister = () => {
  const register = (data) => {
    sessionStorage.setItem("uname", data.username);
  };

  return register;
};

export { useLogout, useLogin, useRegister };
