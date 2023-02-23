import React, { useEffect, useState } from "react";
import AuthContext from "./AuthContext";
import { getItemAsync, setItemAsync as set } from "expo-secure-store";

const AuthContextProvider = ({ children }) => {
  const get = async (key) => {
    try {
      const value = await getItemAsync(key.toString());
      return JSON.parse(value);
    } catch (error) {}
  };
  const defaultAuthState = {
    access_token: get("access_token") || null,
    remember_token: get("remember_token") || null,
    is_logged_in: get("is_logged_in") === "true" || false,
  };

  const [auth, setAuth] = useState(defaultAuthState);

  const setAuthStorage = async (data) => {
    for (const key in auth) {
      try {
        await set(key.toString(), auth[key]);
      } catch (error) {}
    }
    setAuth(data);
  };
  const authObj = { auth, setAuth: setAuthStorage };
  const update = async () => {
    for (const key in auth) {
      try {
        await set(key.toString(), auth[key]);
      } catch (error) {}
    }
  };
  useEffect(() => {
    update();
    return () => {
      console.log("This will be logged on unmount");
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [auth]);
  return (
    <AuthContext.Provider value={authObj}>{children}</AuthContext.Provider>
  );
};

export default AuthContextProvider;
