import { red } from "@material-ui/core/colors";

const themes = {
  light: {
    palette: {
      type: "light",
      primary: {
        main: "#00796b",
      },
      secondary: {
        main: "#795548",
      },
      toolbar: {
        main: "#fff",
      },
    },
  },
  dark: {
    palette: {
      type: "dark",
      background: {
        default: "#222",
      },
      text: {
        primary: "#fff",
        hint: "#131313",
      },
      primary: {
        main: "#AFE9A1",
      },
      secondary: {
        main: "#344966",
      },
    },
  },
};

export default function getTheme(type) {
  return themes[type];
}
