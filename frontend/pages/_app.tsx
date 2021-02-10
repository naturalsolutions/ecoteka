import React from "react";
import Head from "next/head";
import { I18nextProvider } from "react-i18next";
import i18n from "@/i18n";
import "maplibre-gl/dist/mapbox-gl.css";
import { SnackbarProvider } from "notistack";
import ThemeProvider from "@/lib/hooks/useThemeSwitcher";
import AppLayoutBase from "@/components/AppLayout/Base";
import "@/styles/global.css";

import { Provider as AppContextProvider } from "@/providers/AppContext";

function MyApp({ Component, pageProps }) {
  React.useEffect(() => {
    const jssStyles = document.querySelector("#jss-server-side");

    if (jssStyles) {
      jssStyles.parentElement.removeChild(jssStyles);
    }
  }, []);

  return (
    <React.Fragment>
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
            <AppContextProvider>
              <AppLayoutBase>
                <Component {...pageProps} />
              </AppLayoutBase>
            </AppContextProvider>
          </SnackbarProvider>
        </ThemeProvider>
      </I18nextProvider>
    </React.Fragment>
  );
}

export default MyApp;
