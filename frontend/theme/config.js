import { red } from "@material-ui/core/colors";

const themes = {
  light: {
    palette: {
      type: "light",
      background: {
        default: "#fbfdfe",
      },
      text: {
        primary: "#000",
        hint: "#131313",
      },
      primary: {
        light: "#00C6B8",
        main: "#47B9B2",
        dark: "#00675B",
      },
      secondary: {
        light: "#C9A095",
        main: "#A2786D",
        dark: "#734C42",
      },
    },
    typography: {
      fontFamily : "Inter",
      fontSize : "14px",
      fontWeightLight: 300,
      fontWeightRegular: 400,
      fontWeightMedium: 500,
      fontWeightBold: 700,
      h1: {
        fontFamily: "Merriweather",
        fontWeight: 300,
        fontSize: "6rem",
        lineHeight: 1.167,
        letterSpacing: "-1,5px",
      },
      h2: {
        fontFamily: "Merriweather",
        fontWeight: 300,
        fontSize: "3.75rem",
        lineHeight: 1.2,
        letterSpacing: "-0.00833em"
      },
      h3: {
        fontFamily: "Merriweather",
        fontWeight: 400,
        fontSize: "3rem",
        lineHeight: 1.167,
        letterSpacing: "0em",
      },
      h4: {
        fontFamily: "Inter",
        fontWeight: 400,
        fontSize: "2.125rem",
        lineHeight: 1.235,
        letterSpacing: "0.00735em",
      },
      h5: {
        fontFamily: "Inter",
        fontWeight: 400,
        fontSize: "1.5rem",
        lineHeight: 1.334,
        letterSpacing: "0em",
      },
      h6: {
        fontFamily: "Inter",
        fontWeight: 500,
        fontSize: "1.25rem",
        lineHeight: 1.6,
        letterSpacing: "0.0075em",
      },
      subtitle1: {
        fontFamily: "Inter",
        fontWeight: 400,
        fontSize: "1rem",
        lineHeight: 1.75,
        letterSpacing: "0.00938em",
      },
      subtitle2: {
        fontFamily: "Inter",
        fontWeight: 500,
        fontSize: "0.875rem",
        lineHeight: 1.57,
        letterSpacing: "0.00714em",
      },
      body1: {
        fontFamily: "Inter",
        fontWeight: 400,
        fontSize: "1rem",
        lineHeight: 1.5,
        letterSpacing: "0.00938em",
      },
      body2: {
        fontFamily: "Inter",
        fontWeight: 400,
        fontSize: "0.875rem",
        lineHeight: 1.43,
        letterSpacing: "0.01071em",
      },
      button: {
        fontFamily: "Inter",
        fontWeight: 500,
        fontSize: "0.875rem",
        lineHeight: 1.75,
        letterSpacing: "0.02857em",
        textTransform: "uppercase",
      },
      caption: {
        fontFamily: "Inter",
        fontWeight: 400,
        fontSize: "0.75rem",
        lineHeight: 1.66,
        letterSpacing: "0.03333em",
      },
      overline: {
        fontFamily: "Inter",
        fontWeight: 400,
        fontSize: "0.75rem",
        lineHeight: 2.66,
        letterSpacing: "0.08333em",
        textTransform: "uppercase",
      },
    },
    toolbar: {
      main: "#fbfdfe",
    },
  },
  dark: {
    palette: {
      type: "dark",
      background: {
        default: "#384145",
      },
      text: {
        primary: "#fff",
        hint: "#131313",
      },
      primary: {
        light: "#00C6B8",
        main: "#47B9B2",
        dark: "#00675B",
      },
      secondary: {
        light: "#C9A095",
        main: "#A2786D",
        dark: "#734C42",
      },
    },
    typography: {
      fontFamily : "Inter",
      fontSize : "14px",
      fontWeightLight: 300,
      fontWeightRegular: 400,
      fontWeightMedium: 500,
      fontWeightBold: 700,
      h1: {
        fontFamily: "Merriweather",
        fontWeight: 300,
        fontSize: "6rem",
        lineHeight: 1.167,
        letterSpacing: "-1,5px",
      },
      h2: {
        fontFamily: "Merriweather",
        fontWeight: 300,
        fontSize: "3.75rem",
        lineHeight: 1.2,
        letterSpacing: "-0.00833em"
      },
      h3: {
        fontFamily: "Merriweather",
        fontWeight: 400,
        fontSize: "3rem",
        lineHeight: 1.167,
        letterSpacing: "0em",
      },
      h4: {
        fontFamily: "Inter",
        fontWeight: 400,
        fontSize: "2.125rem",
        lineHeight: 1.235,
        letterSpacing: "0.00735em",
      },
      h5: {
        fontFamily: "Inter",
        fontWeight: 400,
        fontSize: "1.5rem",
        lineHeight: 1.334,
        letterSpacing: "0em",
      },
      h6: {
        fontFamily: "Inter",
        fontWeight: 500,
        fontSize: "1.25rem",
        lineHeight: 1.6,
        letterSpacing: "0.0075em",
      },
      subtitle1: {
        fontFamily: "Inter",
        fontWeight: 400,
        fontSize: "1rem",
        lineHeight: 1.75,
        letterSpacing: "0.00938em",
      },
      subtitle2: {
        fontFamily: "Inter",
        fontWeight: 500,
        fontSize: "0.875rem",
        lineHeight: 1.57,
        letterSpacing: "0.00714em",
      },
      body1: {
        fontFamily: "Inter",
        fontWeight: 400,
        fontSize: "1rem",
        lineHeight: 1.5,
        letterSpacing: "0.00938em",
      },
      body2: {
        fontFamily: "Inter",
        fontWeight: 400,
        fontSize: "0.875rem",
        lineHeight: 1.43,
        letterSpacing: "0.01071em",
      },
      button: {
        fontFamily: "Inter",
        fontWeight: 500,
        fontSize: "0.875rem",
        lineHeight: 1.75,
        letterSpacing: "0.02857em",
        textTransform: "uppercase",
      },
      caption: {
        fontFamily: "Inter",
        fontWeight: 400,
        fontSize: "0.75rem",
        lineHeight: 1.66,
        letterSpacing: "0.03333em",
      },
      overline: {
        fontFamily: "Inter",
        fontWeight: 400,
        fontSize: "0.75rem",
        lineHeight: 2.66,
        letterSpacing: "0.08333em",
        textTransform: "uppercase",
      },
    },
    toolbar: {
      main: "#384145",
    },
  },
};

export default function getTheme(type) {
  return themes[type];
}
