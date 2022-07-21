import { createStitches, defaultThemeMap } from "@stitches/react";

export const { styled, globalCss } = createStitches({
  themeMap: {
    ...defaultThemeMap,
  },
  theme: {
    colors: {
      text: "black",
      background: "#F5F5F5",
      hover: "rgba(144, 144, 144, .1)",
      border: "rgba(144, 144, 144, .32)",
      active: "dodgerblue",
      red: "#E35549",
      blue: "#5556AD",
      green: "#36865A",
    },
    space: {
      0: "2px",
      1: "3px",
      2: "4px",
      3: "8px",
      4: "12px",
      5: "16px",
    },
    fontSizes: {
      0: "10px",
      1: "12px",
      2: "13px",
      3: "16px",
      4: "18px",
    },
    fonts: {
      text: '"Urbanist", system-ui, sans-serif',
    },
    fontWeights: {
      0: "400",
      1: "500",
      2: "700",
    },
    lineHeights: {},
    letterSpacings: {},
    sizes: {},
    borderWidths: {
      0: "$1",
    },
    borderStyles: {},
    radii: {
      0: "2px",
      1: "4px",
      2: "8px",
    },
    zIndices: {},
    transitions: {},
  },
  media: {
    xs: "(max-width: 370px)",
    sm: "(min-width: 640px)",
    md: "(min-width: 768px)",
    lg: "(min-width: 1024px)",
    xl: "(min-width: 1680px)",
  },
  utils: {
    zStrokeWidth: () => (value: number) => ({
      strokeWidth: `calc(${value}px / var(--camera-zoom))`,
    }),
  },
});

export default styled;
