import { useMemo, createContext, useContext } from "react";
import {
  CssBaseline,
  useMediaQuery,
  createMuiTheme,
  ThemeProvider,
} from "@material-ui/core";
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
  palette: {
    type: "light",
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
  const prefersDarkMode = useMediaQuery("(prefers-color-scheme: dark)");
  const [dark, setDark] = useLocalStorage<boolean>(
    "etk:settings:colorScheme",
    prefersDarkMode
  );

  const theme = useMemo(() => {
    return dark ? themeDark : themeLight;
  }, [dark]);

  return (
    <ThemeContext.Provider
      value={{ theme: theme ?? themeLight, dark, setDark }}
    >
      <CssBaseline />
      <ThemeProvider theme={theme}>{children}</ThemeProvider>
    </ThemeContext.Provider>
  );
}

export const useThemeContext = () => useContext(ThemeContext);
