import { useEffect } from "react";
import Head from "next/head";
import { I18nextProvider } from "react-i18next";
import i18n from "@/i18n";
import "maplibre-gl/dist/maplibre-gl.css";
import { SnackbarProvider } from "notistack";
import ThemeProvider from "@/lib/hooks/useThemeSwitcher";
import AppLayoutBase from "@/components/AppLayout/Base";
import "@/styles/global.css";
import { useRouter } from "next/router";
import { QueryClient, QueryClientProvider } from "react-query";
import { ReactQueryDevtools } from "react-query/devtools";
import "@fontsource/chivo";
import "@fontsource/inter";
import "@fontsource/archivo";
import "@fontsource/quando";

import { Provider as AppContextProvider } from "@/providers/AppContext";

const queryClient = new QueryClient();

function MyApp({ Component, pageProps }) {
  const router = useRouter();

  useEffect(() => {
    const jssStyles = document.querySelector("#jss-server-side");

    if (jssStyles) {
      jssStyles.parentElement.removeChild(jssStyles);
    }
  }, []);

  useEffect(() => {
    i18n.changeLanguage(router.locale);
  }, [router.locale]);

  return (
    <>
      <Head>
        <title>EcoTeka</title>
        <meta
          name="viewport"
          content="width=device-width,initial-scale=1.0,minimum-scale=1.0,maximum-scale=1.0,user-scalable=no"
        />
      </Head>
      <I18nextProvider i18n={i18n}>
        <ThemeProvider>
          <SnackbarProvider maxSnack={4}>
            <QueryClientProvider client={queryClient}>
              <ReactQueryDevtools initialIsOpen={false} />
              <AppContextProvider>
                <AppLayoutBase>
                  <Component {...pageProps} />
                </AppLayoutBase>
              </AppContextProvider>
            </QueryClientProvider>
          </SnackbarProvider>
        </ThemeProvider>
      </I18nextProvider>
    </>
  );
}

export default MyApp;
