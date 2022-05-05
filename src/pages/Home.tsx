import React, { useMemo } from "react";
import { v4 as uuid } from "uuid";
import { Navigate } from "react-router-dom";

import { isNativeApp } from "../lib/tauri";

import logoBMBF from "../assets/images/logo-bmbf.svg";
import logoOKFN from "../assets/images/logo-okfn.svg";

const Home = () => {
  // Redirects to a random board when opening the native app
  if (isNativeApp) {
    return <Navigate replace to={`/board/${uuid()}`} />;
  }

  return (
    <main>
      <h1>Fullscreen is a local-first collaborative whiteboard</h1>
      <div className="logos">
        <img
          src={logoBMBF}
          alt="gefördert vom Bundesministerium für Bildung und Forschung"
        />
        <img src={logoOKFN} alt="Logo Open Knowledge Foundation Deutschland" />
      </div>
    </main>
  );
};

export default Home;
