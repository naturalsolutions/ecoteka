import { useMemo, createContext, useContext } from "react";
import { CssBaseline, createMuiTheme, ThemeProvider } from "@material-ui/core";
import useLocalStorage from "@/lib/hooks/useLocalStorage";

const themeDark = createMuiTheme({
  palette: {
    type: "dark",
    primary: {
      main: "#AFE9A1",
    },
    secondary: {
      main: "#344966",
    },
  },
});

const themeLight = createMuiTheme({
  typography: {
    fontFamily: ["Inter", "-apple-system", "sans-serif"].join(","),
    body1: {
      fontFamily: ["Inter", "-apple-system", "sans-serif"].join(","),
    },
    body2: {
      fontFamily: ["Inter", "-apple-system", "sans-serif"].join(","),
    },
    button: {
      fontFamily: ["Inter", "-apple-system", "sans-serif"].join(","),
      fontWeight: 700,
    },
    h1: {
      fontFamily: ["Quando", "-apple-system", "sans-serif"].join(","),
      fontWeight: 700,
    },
    h2: {
      fontFamily: ["Quando", "-apple-system", "sans-serif"].join(","),
      fontWeight: 700,
    },
    h3: {
      fontFamily: ["Quando", "-apple-system", "sans-serif"].join(","),
      fontWeight: 700,
    },
    h4: {
      fontFamily: ["Quando", "-apple-system", "sans-serif"].join(","),
      fontWeight: 700,
    },
    h5: {
      fontFamily: ["Inter", "-apple-system", "sans-serif"].join(","),
      fontWeight: 600,
    },
    h6: {
      fontFamily: ["Inter", "-apple-system", "sans-serif"].join(","),
      fontWeight: 600,
    },
  },
  palette: {
    type: "light",
    background: {
      default: "#f6faf8",
    },
    primary: {
      main: "#1d675b",
    },
    secondary: {
      main: "#EFFBF9",
    },
  },
});

export const ThemeContext = createContext(null);

export default function Provider({ children }) {
  const [dark, setDark] = useLocalStorage<boolean>(
    "etk:settings:colorScheme",
    false
  );

  const theme = useMemo(() => {
    return dark ? themeDark : themeLight;
  }, [dark]);

  return (
    <ThemeContext.Provider
      value={{ theme: theme || themeLight, dark, setDark }}
    >
      <CssBaseline />
      <ThemeProvider theme={theme}>{children}</ThemeProvider>
    </ThemeContext.Provider>
  );
}

export const useThemeContext = () => useContext(ThemeContext);
