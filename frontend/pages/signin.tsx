import Head from "next/head";
import AppLayoutGeneral from "@/components/AppLayout/General";
import FormSignIn from "@/components/Login/FormSignIn";

export default function SignInPage() {
  return (
    <AppLayoutGeneral>
      <Head>
        <title>ecoTeka - Sign In</title>
      </Head>
      <FormSignIn />
    </AppLayoutGeneral>
  );
}
