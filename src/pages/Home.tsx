import React, { useMemo } from "react";
import { v4 as uuid } from "uuid";
import { Navigate } from "react-router-dom";

import { styled } from "../styles";
import { isNativeApp } from "../lib/tauri";

import LogoBMBF from "../assets/images/logo-bmbf.svg";
import LogoOKFN from "../assets/images/logo-okfn.svg";

export const Home = () => {
  // Redirects to a random board when opening the native app
  if (isNativeApp()) {
    return <Navigate replace to={`/board/${uuid()}`} />;
  }

  return (
    <HomeContainer>
      <Heading>Fullscreen is a local-first collaborative whiteboard</Heading>
      <Feature>
        <h2>No cloud required</h2>
        <p>
          Fullscreen is local-first software. Your data will live on your computer, giving you full control over sharing and deleting.  You can work offline as well as in real-time in a collaborative session.          
        </p>
      </Feature>
      <Feature>
        <h2>Open and secure</h2>
        <p>
          Fullscreen is open-source software. You will always be able to see what is in our codebase and have independent people check it for security. We implement strong privacy and safety standards.          
        </p>
      </Feature>
      <Feature>
        <h2>A canvas for teams</h2>
        <p>
          Fullscreen focuses on visual note-taking for teams. This includes the basics for a whiteboard (texts, sticky notes, sections), as well as visualisation and facilitation features. Fullscreen is beginner-friendly in the web browser and offers expert options in the native app.         
        </p>
      </Feature>
      <Logos>
        <LogoBMBF alt="gefördert vom Bundesministerium für Bildung und Forschung" />
        <LogoOKFN alt="Logo Open Knowledge Foundation Deutschland" />
      </Logos>
    </HomeContainer>
  );
};

const HomeContainer = styled("main", {
  display: "flex",
  alignItems: "center",
  flexDirection: "column",
  padding: "$4",
  height: "100vh",
  width: "100vw",
  overflow: "auto",
  backgroundColor: "$background",
});

const Heading = styled("h1", {
  marginBottom: "3em",
  maxWidth: "15em",
  textAlign: "center",
  fontFamily: "$text",
  fontSize: "3em",
  color: "$blue",
  wordBreak: "keep-all",
  "@md": {
    fontSize: "5em",
  },
});

const Heading = styled("h2", {
  marginBottom: "3em",
  maxWidth: "15em",
  textAlign: "center",
  fontFamily: "$text",
  fontSize: "1em",  
  color: "$blue",
  wordBreak: "keep-all",
});

const Logos = styled("section", {
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  "& > svg": {
    width: "50%",
    height: "100%",
  },
  "@sm": {
    flexDirection: "row",
    justifyContent: "center",
    "& > svg": {
      width: "100%",
      maxWidth: 200,
    },
  },
});
