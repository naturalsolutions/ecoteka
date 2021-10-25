import { useMemo, createContext, useContext } from "react";
import { CssBaseline, createTheme, ThemeProvider } from "@material-ui/core";
import { responsiveFontSizes } from "@material-ui/core/styles";

import useLocalStorage from "@/hooks/useLocalStorage";
import getTheme from "@/theme/config";

const themeDark = responsiveFontSizes(createTheme(getTheme("dark")));
const themeLight = responsiveFontSizes(createTheme(getTheme("light")));

export const ThemeContext = createContext(null);

export default function Provider({ children }): JSX.Element {
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
