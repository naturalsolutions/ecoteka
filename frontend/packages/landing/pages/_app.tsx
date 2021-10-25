import { useEffect } from "react";
import "@/styles/globals.css";
import type { AppProps } from "next/app";
import i18n from "@/i18n/config";
import { I18nextProvider } from "react-i18next";
import LayoutBase from "@/components/Layout/Base";
import { useRouter } from "next/router";
import Head from "next/head";
import "@fontsource/inter";
import "@fontsource/merriweather";
import * as ga from "@/lib/ga";
import ThemeProvider from "@/hooks/useThemeSwitcher";

function MyApp({ Component, pageProps }: AppProps) {
  const router = useRouter();

  useEffect(() => {
    i18n.changeLanguage(router.locale);
  }, [router.locale]);

  useEffect(() => {
    const handleRouteChange = (url) => {
      ga.pageview(url);
    };
    
    router.events.on("routeChangeComplete", handleRouteChange);

    return () => {
      router.events.off("routeChangeComplete", handleRouteChange);
    };
  }, [router.events]);

  useEffect(() => {
    ga.pageview(router.pathname);
  }, [])

  return (
    <I18nextProvider i18n={i18n}>
      <ThemeProvider>
        <Head>
          <meta charSet="utf-8" />
          <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
          <meta
            name="viewport"
            content="width=device-width,initial-scale=1,minimum-scale=1,maximum-scale=6"
          />
          <meta name="description" content="Description" />
          <meta name="keywords" content="Keywords" />
          <title>ecoTeka</title>

          <link rel="manifest" href="/manifest.json" />
          <link
            href="/icons/favicon-16x16.png"
            rel="icon"
            type="image/png"
            sizes="16x16"
          />
          <link
            href="/icons/favicon-32x32.png"
            rel="icon"
            type="image/png"
            sizes="32x32"
          />
          <link rel="apple-touch-icon" href="/apple-icon.png" />
          <meta name="apple-mobile-web-app-status-bar" content="#317EFB" />
          <meta name="theme-color" content="#317EFB" />

          <script
            async
            src={`https://www.googletagmanager.com/gtag/js?id=${process.env.GOOGLE_ANALYTICS}`}
          />

          <script
            dangerouslySetInnerHTML={{
              __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${process.env.GOOGLE_ANALYTICS}', {
              page_path: window.location.pathname,
            });
          `,
            }}
          />
        </Head>
        <LayoutBase>
          <Component {...pageProps} />
        </LayoutBase>
      </ThemeProvider>
    </I18nextProvider>
  );
}

export default MyApp;
