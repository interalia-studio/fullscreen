import React, { useMemo } from "react";
import { v4 as uuid } from "uuid";
import { Navigate } from "react-router-dom";

import { styled } from "~/styles";
import { isNativeApp } from "~/lib/tauri";

import LogoBMBF from "../assets/images/logo-bmbf.svg";
import LogoOKFN from "../assets/images/logo-okfn.svg";
import { NONAME } from "dns";

export const Home = () => {
  // Redirects to a random board when opening the native app
  if (isNativeApp()) {
    return <Navigate replace to={`/board/${uuid()}`} />;
  }

  return (
    <Wrapper>
      <HomeContainer>
        <Title>Fullscreen</Title>
        <Subtitle>&mdash;truly, yours.</Subtitle>
        <HeroImage src={require("~/assets/images/visual_play.png")} alt="Fullscreen is a visual canvas app"/>
        <Heading>Fullscreen is a collaborative whiteboard that allows you to own your data.</Heading>
          <Features>
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
          </Features>
        <Button>Download Fullscreen</Button>
        <Logos>
          <LogoBMBF alt="gefördert vom Bundesministerium für Bildung und Forschung" />
          <LogoOKFN alt="Logo Open Knowledge Foundation Deutschland" />
        </Logos>
      </HomeContainer>
    </Wrapper>
  );
};

const Wrapper = styled("div", {
  padding: 10,
  width: "100vw",
  backgroundColor: "$background",
  "@sm": {
    padding: 40,
  },
  "@md": {
    padding: 80,
  },
  "@lg": {
    padding: 200,
  },
});

const HomeContainer = styled("main", {
  display: "flex",
  alignItems: "left",
  flexDirection: "column",
  width: "100%",
  position: "relative",
  overflow: "auto",
  fontFamily: "$text",
  color: "$blue",
});

const HeroImage = styled("img", {
  margin: 10,
  display: "none",
  "@sm": {
    display: "block",
  },
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
  marginBottom: "1em",
  textAlign: "right",
  fontSize: "1.5em",  
  wordBreak: "keep-all",
  "@md": {
    fontSize: "2em",
  },
});

const Features = styled("section", {
  width: "100%",
  display: "flex",
  position: "relative",
  flexDirection: "row",
  flexWrap: "wrap",
  alignItems: "stretch",
  marginBottom: "3em",
  "@sm": {
    // justifyContent: "center",
  },
});

const Box = styled("div", {
  display: "inline-block",
  flexDirection: "column",
  paddingRight: "20px",
  "@md": {
    flexDirection: "column",
    width: "50%",
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
  border: "3px solid $blue",
  padding: "6px",
  borderRadius: "10px",
  position: "relative",
  overflow: "auto",
  fontFamily: "$text",
  fontSize: "$4",
  color: "$blue",
  width: "normal",
  marginBottom: "3em",
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
