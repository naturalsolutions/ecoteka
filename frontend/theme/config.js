import { red } from "@material-ui/core/colors";

const themes = {
  light: {
    palette: {
      type: "light",
      primary: {
        main: "#009688",
      },
      secondary: {
        main: "#6d4c41",
      },
      toolbar: {
        main: "#fff",
      },
    },
  },
  dark: {
    palette: {
      type: "dark",
      primary: {
        main: "#80cbc4",
      },
      secondary: {
        main: "#bcaaa4",
      },
      toolbar: {
        main: "#000",
      },
    },
  },
};

export default function getTheme(type) {
  return themes[type];
}
