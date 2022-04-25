import React from "react";
import logoBMBF from "../assets/images/logo-bmbf.svg";
import logoOKFN from "../assets/images/logo-okfn.svg";

const Home = () => (
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

export default Home;
