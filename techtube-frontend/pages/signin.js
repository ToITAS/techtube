import Navbar from "../components/Navbar";
import Link from "next/link";
import { useState } from "react";

import { useAuth } from "../lib/context/AuthContext";

export default function SignIn() {
  const [usernameText, setUsernameText] = useState("");
  const [passwordText, setPasswordText] = useState("");

  const { login } = useAuth();

  async function handleSignInClicked() {
    if (usernameText && passwordText) {
      login(usernameText, passwordText);
    }
  }

  return (
    <>
      <Navbar />
      <div className="login-root">
        <div className="login">
          <h2>Logg inn</h2>
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
            <button onClick={handleSignInClicked}>Logg inn</button>
          </div>
          <div className="login-subsection">
            <h5>Ingen bruker?</h5>
            <Link href="/signup">Registrer deg</Link>
          </div>
        </div>
      </div>
    </>
  );
}

export async function getServerSideProps() {
  return { props: {} };
}
