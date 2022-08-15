import React, { useMemo } from "react";
import { v4 as uuid } from "uuid";
import { Navigate } from "react-router-dom";

import { styled } from "~/styles";
import { isNativeApp } from "~/lib/tauri";

import LogoBMBF from "../assets/images/logo-bmbf.svg";
import LogoOKFN from "../assets/images/logo-okfn.svg";

export const Home = () => {
  // Redirects to a random board when opening the native app
  if (isNativeApp()) {
    return <Navigate replace to={`/board/${uuid()}`} />;
  }

  return (
    <HomeContainer>
      <Title>Fullscreen</Title>
      <Subtitle>&mdash;truly, yours</Subtitle>
      <img 
        src={require("~/assets/images/visual_play.png")}
        alt="Fullscreen is a visual canvas app" />
      <Heading>Fullscreen is a collaborative whiteboard that allows you to own your data.</Heading>
      <Container>
        <Box>
          <Heading>No cloud required</Heading>
          <Text>
            Fullscreen is local-first software. Your data will live on your computer, giving you full control over sharing and deleting.  You can work offline as well as in real-time in a collaborative session.          
          </Text>
        </Box>
        <Box>
          <Heading>Open and secure</Heading>
          <Text>
            Fullscreen is open-source software. You will always be able to see what is in our codebase and have independent people check it for security. We implement strong privacy and safety standards.          
          </Text>
        </Box>
        <Box>
        <Heading>A canvas for teams</Heading>
        <Text>
          Fullscreen focuses on visual note-taking for teams. This includes the basics for a whiteboard (texts, sticky notes, sections), as well as visualisation and facilitation features. Fullscreen is beginner-friendly in the web browser and offers expert options in the native app.         
        </Text>
        </Box>
      </Container>
      <Button>Download Fullscreen</Button>
      <Logos>
        <LogoBMBF alt="gefördert vom Bundesministerium für Bildung und Forschung" />
        <LogoOKFN alt="Logo Open Knowledge Foundation Deutschland" />
      </Logos>
    </HomeContainer>
  );
};

const HomeContainer = styled("main", {
  display: "flex",
  alignItems: "left",
  flexDirection: "column",
  padding: "150px",
  height: "100vh",
  width: "100vw",
  overflow: "auto",
  fontFamily: "$text",
  color: "$blue",
  backgroundColor: "$background",
});

const Title = styled("h1", {
  marginBottom: "1em",
  maxWidth: "15em",
  textAlign: "left",
  fontSize: "3em",
  wordBreak: "keep-all",
  "@md": {
    fontSize: "5em",
  },
});

const Subtitle = styled("h2", {
  marginBottom: "3em",
  maxWidth: "15em",
  textAlign: "right",
  fontSize: "1.8em",  
  wordBreak: "keep-all",
  "@md": {
    fontSize: "3em",
  },
});

const Container = styled("section", {
  width: "100%",
  display: "grid",
  gridTemplateColumns: "50% 50%",
  gridRow: "auto auto",
  // gridColumnGap: "20px",
  // gridRowGap:"20px",
  flexDirection: "column",
  alignItems: "center",
  marginBottom: "3em",
  "@sm": {
    flexDirection: "row",
    justifyContent: "center",
  },
});

const Box = styled("div", {
  padding: "20px",
  flexDirection: "row",
  alignItems: "center",
  "@sm": {
    flexDirection: "row",
    justifyContent: "center",
  },
});

const Text = styled("p", {
  textAlign: "left",
  "@sm": {
    flexDirection: "row",
    justifyContent: "center",
  },
});

const Heading = styled("h3", {
  marginBottom: "1em",
  textAlign: "left",
  fontSize: "1.8em",  
  wordBreak: "keep-all",
  "@md": {
    fontSize: "1.8em",
  },
});

const Button = styled("button", {
  // display: "flex",
  // flexDirection: "column",
  // background: "$blue",
  border: "3px solid $blue",
  padding: "6px",
  borderRadius: "10px",
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
