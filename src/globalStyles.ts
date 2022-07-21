import type { CSS } from "@stitches/react";
import { normalize } from "stitches-normalize-css";

import { globalCss } from "./stitches.config";

import urbanistWoff from "url:./assets/fonts/urbanist-v8-latin-regular.woff";
import urbanistWoff2 from "url:./assets/fonts/urbanist-v8-latin-regular.woff2";

const styles: Record<string, CSS> = {
  "*": {
    boxSizing: "border-box",
  },
  "html, body": {
    margin: 0,
    padding: 0,
  },
  "@font-face": [
    {
      fontFamily: "Urbanist",
      fontWeight: 400,
      fontStyle: "normal",
      fontDisplay: "swap",
      src: `local(''), url(${urbanistWoff2}) format('woff2'), url(${urbanistWoff}) format('woff')`,
    },
    {
      fontFamily: "Urbanist",
      fontWeight: 700,
      fontStyle: "normal",
      fontDisplay: "swap",
      src: `local(''), url(${urbanistWoff2}) format('woff2'), url(${urbanistWoff}) format('woff')`,
    },
    {
      fontFamily: "Urbanist",
      fontWeight: 900,
      fontStyle: "normal",
      fontDisplay: "swap",
      src: `local(''), url(${urbanistWoff2}) format('woff2'), url(${urbanistWoff}) format('woff')`,
    },
  ],
};

export const globalStyles = globalCss(...normalize, styles);
