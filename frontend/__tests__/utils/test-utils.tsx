// test-utils.js
import { render } from "@testing-library/react";
import i18n from "@/i18n";
import { I18nextProvider } from "react-i18next";
import { Provider as AppContextProvider } from "@/providers/AppContext";
import ThemeProvider from "@/lib/hooks/useThemeSwitcher";
import { SnackbarProvider } from "notistack";
import { QueryClient, QueryClientProvider } from "react-query";
import { RouterContext } from "next/dist/next-server/lib/router-context";
import router from "next/router";

jest.mock("next/router", () => require("next-router-mock"));

const queryClient = new QueryClient();

const Providers = ({ children }) => {
  return (
    <RouterContext.Provider value={{ ...router }}>
      <I18nextProvider i18n={i18n}>
        <ThemeProvider>
          <SnackbarProvider maxSnack={4}>
            <QueryClientProvider client={queryClient}>
              <AppContextProvider>{children}</AppContextProvider>
            </QueryClientProvider>
          </SnackbarProvider>
        </ThemeProvider>
      </I18nextProvider>
    </RouterContext.Provider>
  );
};

const customRender = (ui, options = {}) =>
  render(ui, { wrapper: Providers, ...options });

// re-export everything
export * from "@testing-library/react";

// override render method
export { customRender as render };
