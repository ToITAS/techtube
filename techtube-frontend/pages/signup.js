import Navbar from "../components/Navbar";
import Link from "next/link";
import { useState } from "react";
import Router from "next/router";

export default function SignUp() {
  const [usernameText, setUsernameText] = useState("");
  const [passwordText, setPasswordText] = useState("");

  async function handleSignUpClicked() {
    if (usernameText && passwordText) {
      const response = await fetch("/api/brukere/ny", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          brukernavn: usernameText,
          passord: passwordText,
        }),
      });

      if (response.status === 201) {
        Router.push("/signin");
      }
    }
  }

  return (
    <>
      <Navbar />
      <div className="login-root">
        <div className="login">
          <h2>Registrer deg</h2>
          <div className="login-inputs">
            <input
              type="text"
              placeholder="Brukernavn"
              value={usernameText}
              onChange={(e) => setUsernameText(e.target.value)}
            />
            <input
              type="text"
              placeholder="Passord"
              value={passwordText}
              onChange={(e) => setPasswordText(e.target.value)}
            />
            <button onClick={handleSignUpClicked}>Registrer</button>
          </div>
          <div className="login-subsection">
            <h5>Allerede en bruker?</h5>
            <Link href="/signin">Logg inn</Link>
          </div>
        </div>
      </div>
    </>
  );
}

export async function getServerSideProps() {
  return { props: {} };
}
