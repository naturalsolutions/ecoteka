import React from "react";
import Head from 'next/head'
import App from "next/app";

import "../css/antd.less";

class MyApp extends App {
  render() {
    const { Component, pageProps } = this.props;

    return <>
      <Head>
        <title>EcoTeka</title>
      </Head>
      <Component {...pageProps} />
    </>;
  }
}

export default MyApp;
