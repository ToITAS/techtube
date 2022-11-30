import { createContext } from "react";
import Router from "next/router";
import React from "react";

const AuthContext = createContext();

export const getUser = async (ctx) => {
  if (ctx.req.cookies.token) {
    try {
      const response = await fetch(process.env.API_BASE_URL + "/api/validate", {
        method: "POST",
        mode: "cors",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          Authorization:
            "Bearer " + ctx.req.cookies.token
              ? ctx.req.cookies.token
              : undefined,
        },
      });
      if (response.status === 200) {
        return { status: true, user: await response.json() };
      }
    } catch {}
  }
  return { status: false, user: null };
};

export const AuthProvider = (props) => {
  const auth = props.myAuth || { status: false, user: null };

  const login = async (username, password) => {
    console.log("Logging in...");
    const response = await fetch("/api/autoriser", {
      method: "POST",
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        brukernavn: username,
        passord: password,
      }),
      credentials: "include",
    }).then((result) => {
      console.log(result);
      if (result.status === 200) {
        Router.push("/");
      }
    });
  };

  const logout = async () => {
    await fetch("/api/deautoriser", {
      method: "POST",
      mode: "cors",
      credentials: "include",
    }).then(() => Router.push("/"));
  };

  return <AuthContext.Provider value={{ auth, login, logout }} {...props} />;
};

export const useAuth = () => React.useContext(AuthContext);
export const AuthConsumer = AuthContext.Consumer;
