import React, { useMemo } from "react";
import { v4 as uuid } from "uuid";
import { Navigate } from "react-router-dom";

import { isNativeApp } from "../lib/tauri";

import LogoBMBF from "../assets/images/logo-bmbf.svg";
import LogoOKFN from "../assets/images/logo-okfn.svg";
import styled from "../stitches.config";

export const Home = () => {
  // Redirects to a random board when opening the native app
  if (isNativeApp()) {
    return <Navigate replace to={`/board/${uuid()}`} />;
  }

  return (
    <HomeContainer>
      <Heading>Fullscreen is a local-first collaborative whiteboard</Heading>
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
