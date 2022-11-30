import "../styles/globals.css";
import "../styles/fonts.css";

import App from "next/app";
import Head from "next/head";
import { AuthProvider, getUser } from "../lib/context/AuthContext";

import Navbar from "../components/Navbar";

function MyApp({ Component, pageProps, auth }) {
  return (
    <AuthProvider myAuth={auth}>
      <Head>
        <link rel="shortcut icon" href="/favicon.svg" />
      </Head>
      <div className="page-root">
        <div className="background-wrapper">
          <img src="/background.svg" alt="" />
        </div>
        <div className="page-root-inner">
          <Component {...pageProps} />
        </div>
      </div>
    </AuthProvider>
  );
}

MyApp.getInitialProps = async (appContext) => {
  const appProps = await App.getInitialProps(appContext);
  const auth = await getUser(appContext.ctx);
  return { ...appProps, auth: auth };
};

export default MyApp;
