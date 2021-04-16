import { useMemo, createContext, useContext } from "react";
import { CssBaseline, createMuiTheme, ThemeProvider } from "@material-ui/core";
import useLocalStorage from "@/lib/hooks/useLocalStorage";
import getTheme from "@/theme/config";

const themeDark = createMuiTheme(getTheme("dark"));
const themeLight = createMuiTheme(getTheme("light"));

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
