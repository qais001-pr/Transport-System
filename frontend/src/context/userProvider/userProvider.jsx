import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import useUserProfile from "../../hooks/users/useUserProfile";
import userContext from "../userContext";

export const UserProvider = ({ children }) => {
  const [token, setToken] = useState(null);
  const [user, setUser] = useState(null);
  const isLogin = !!token;

  const {
    data: userData,
    isLoading: isUserLoading,
    isError: isUserError,
    isFetched,
    error: profileError,
  } = useUserProfile();

  const logOut = () => {
    setToken(null);
    setUser(null);
    Cookies.remove("token");
    window.location.replace("/login");
  };

  useEffect(() => {
    const userToken = Cookies.get("token");
    if (userToken) {
      setToken(userToken);
    }
  }, []);

  useEffect(() => {
    if (token && isFetched && !isUserLoading) {
      if (userData?.user) {
        setUser(userData.user);
      } else if (isUserError && profileError?.response?.status === 401) {
        console.warn("Unauthorized - Clearing token");
        Cookies.remove("token");
        setToken(null);
        setUser(null);
        window.location.replace("/login");
      }
    }
  }, [token, userData, isFetched, isUserLoading, isUserError, profileError]);

  useEffect(() => {
    if (!token) {
      setUser(null);
    }
  }, [token]);

  const value = {
    token,
    isLogin,
    user,
    setUserToken: (newToken) => {
      if (newToken) {
        Cookies.set("token", newToken, {
          expires: 1,
          // secure: true,
          sameSite: "strict",
          path: "/",
        });
        setToken(newToken);
        console.log("Token set successfully");
      } else {
        Cookies.remove("token");
        setToken(null);
        console.log("Token removed successfully");
      }
    },
    setUser,
    isUserLoading,
    isUserError,
    logOut,
  };

  return <userContext.Provider value={value}>{children}</userContext.Provider>;
};
