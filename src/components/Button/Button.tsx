import { styled } from "~/styles";

export const Button = styled("button", {
  display: "inline-block",
  padding: "5px 10px",
  backgroundColor: "white",
  borderRadius: "$2",
  borderWidth: "2px",
  cursor: "pointer",
  "& + &": {
    marginLeft: 10,
  },
  "&:hover": {
    backgroundColor: "$hover",
  },
  variants: {
    primary: {
      true: {
        backgroundColor: "$blue",
        color: "white",
        "&:hover": {
          backgroundColor: "$blueHover",
        },
      },
    },
  },
});
