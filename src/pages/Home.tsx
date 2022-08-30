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
    <Wrapper>
      <HomeContainer>
      <Logo src={require("~/assets/images/fullscreen_logo.png")} alt="Fullscreen Logo"/>
        <Hero>
          <Title>Fullscreen is a collaborative whiteboard that allows you to own your data.</Title>
          <ButtonGroup>
            <PrimaryButton href="/board">Open in browser</PrimaryButton>
            <Button href="https://github.com/interalia-studio/fullscreen/releases/tag/v0.2.0">Download Fullscreen</Button>
          </ButtonGroup>
        </Hero>
        <Feature>
          <Visual src={require("~/assets/images/visual1.png")} alt="Fullscreen Visual 1"/>
            <Box>
              <Heading>No cloud required</Heading>
                <Text>
                  Fullscreen is local-first software. Your data will live on your computer, giving you full control over sharing and deleting.  You can work offline as well as in real-time in a collaborative session.          
                </Text>
            </Box>
        </Feature>
        <Feature>
            <Box>
              <Heading>Open and secure</Heading>
                <Text>
                  Fullscreen is open-source software. You will always be able to see what is in our codebase and have independent people check it for security. We implement strong privacy and safety standards.          
                </Text>
            </Box>
            <Visual src={require("~/assets/images/visual2.png")} alt="Fullscreen Visual 2"/>
          </Feature>
          <Feature>
          <Visual src={require("~/assets/images/visual3.png")} alt="Fullscreen Visual 3"/>
            <Box>
            <Heading>A canvas for teams</Heading>
              <Text>
                Fullscreen focuses on visual note-taking for teams. This includes the basics for a whiteboard (texts, sticky notes, sections), as well as visualisation and facilitation features. Fullscreen is beginner-friendly in the web browser and offers expert options in the native app.         
              </Text>
            </Box>
          </Feature>
        <Caption>&mdash;truly, yours.</Caption>
        <Line />
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
  "@xl": {
    paddingTop: 200,
    paddingLeft: 400,
    paddingRight: 400,    
  },
});

const HomeContainer = styled("main", {
  // display: "flex",
  alignItems: "left",
  flexDirection: "column",
  width: "100%",
  position: "relative",
  overflow: "auto",
  fontFamily: "$text",
  color: "$blue",
});

const Logo = styled("img", {
  marginBottom: "1em",
  maxWidth: "15em",
  "@sm": {
    display: "block",
  },
});

const Hero = styled("div", {
  width: "100%",
  display: "flex",
  flexDirection: "column",
  // position: "relative",
  // flexWrap: "wrap",
  alignItems: "center",
  marginBottom: "3em",
  "@sm": {
    flexDirection: "row",
    justifyContent: "flex-start",
  },
  "@xl": {
    gap: 20,
});

const Title = styled("h1", {
  marginBottom: "1em",
  textAlign: "left",
  fontSize: "30px",  
  wordBreak: "keep-all",
  columnGap: 20,
});

const Feature = styled("div", {
  width: "100%",
  display: "flex",
  position: "relative",
  flexDirection: "row",
  justifyContent: "space-between",
  flexWrap: "nowrap",
  marginBottom: "3em",
});

const Visual = styled("img", {
  "@xs": {
    maxHeight: "100px",
  },
});

const Box = styled("div", {
  display: "inline-block",
  flexDirection: "column",
  paddingRight: "20px",
  flexGrow: 2,
  "@xs": {
    flexDirection: "column",
    width: "50%",
  },
});

const Text = styled("p", {
  textAlign: "left",
  fontSize: "20px",
  "@sm": {
    flexDirection: "row",
    justifyContent: "center",
  },
});

const Heading = styled("h3", {
  marginBottom: "1em",
  textAlign: "left",
  fontSize: "30px",
  wordBreak: "keep-all",
});

const ButtonGroup = styled("div", {
  display: "flex",
  position: "relative",
  flexDirection: "column",
  alignItems: "center",
  columnGap: 20,
  "@xl": {
    columnGap: 20,
  "@sm": {
    flexDirection: "row",
    justifyContent: "right",
    flexWrap: "wrap",
  },
});

const Button = styled("a", {
  border: "3px solid $blue",
  borderRadius: "10px",
  position: "relative",
  padding: "6px",
  overflow: "auto",
  fontFamily: "$text",
  fontSize: "20px",
  fontWeight: "$2",
  textDecoration: "none",
  textAlign: "center",
  color: "$blue",
  width: "250px",
  marginBottom: 20,
});

const PrimaryButton = styled("a", {
  border: "3px solid $blue",
  backgroundColor: "$blue", 
  borderRadius: "10px",
  position: "relative",
  padding: "6px",
  overflow: "auto",
  fontFamily: "$text",
  fontSize: "20px",
  fontWeight: "$2",
  textDecoration: "none",
  textAlign: "center",
  color: "$background",
  width: "250px",
  marginBottom: 20,
});

const Caption = styled("h2", {
  marginBottom: "1em",
  textAlign: "right",
  fontSize: "$3",  
  wordBreak: "keep-all",
  "@md": {
    fontSize: "2em",
  },
});

const Line = styled("hr", {
  border: "2px solid $red";
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
