import React, { useMemo } from "react";
import { v4 as uuid } from "uuid";
import { Navigate } from "react-router-dom";

import { isNativeApp } from "../lib/tauri";
import { Footer } from "../components/Footer";

import logoBMBF from "../assets/images/logo-bmbf.svg";
import logoOKFN from "../assets/images/logo-okfn.svg";
import visualPlay from "../assets/images/visual-play.png";

import "./home.css";

const Home = () => {
  // Redirects to a random board when opening the native app
  if (isNativeApp()) {
    return <Navigate replace to={`/board/${uuid()}`} />;
  }

  return (
    <div className="landingContainer">
      <main className="landing">
        <h1>
          <strong> Fullscreen </strong>
        </h1>

        <h2>— truly, yours.</h2>

        <img src={visualPlay} className="visualplay box" alt="Web2.0" />

        <h3>
          Fullscreen is a collaborative whiteboard that allows you to own your
          data.
        </h3>

        <hr />
        <br />

        <div>
          <p>
            <strong> No cloud required</strong>
            <br />
          </p>

          <p>
            Fullscreen is local-first software. Your data will live on your
            computer, giving you full control over sharing and deleting. You can
            work offline as well as in real-time in a collaborative session.
            <br />
          </p>
          <p>
            <strong> Open and secure </strong>
            <br />
          </p>

          <p>
            Fullscreen is open-source software. You will always be able to see
            what is in our codebase and have independent people check it for
            security. We implement strong privacy and safety standards.
          </p>

          <p>
            <strong> A canvas for team </strong>
          </p>
          <p>
            Fullscreen focuses on visual note-taking for teams. This includes
            the basics for a whiteboard (texts, sticky notes, sections), as well
            as visualisation and facilitation features. Fullscreen is
            beginner-friendly in the web browser and offers expert options in
            the native app.
            <br />
          </p>
          <br />
          <button type="button">Download Fullscreen</button>
          <br />
          <br />
          <br />
          <hr />
          <br />
        </div>

        <div className="logos">
          <img
            src={logoBMBF}
            alt="gefördert vom Bundesministerium für Bildung und Forschung"
          />
          <img
            src={logoOKFN}
            alt="Logo Open Knowledge Foundation Deutschland"
          />
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Home;
