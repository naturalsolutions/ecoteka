import Head from "next/head";
import { useTranslation } from "react-i18next";
import AppLayoutGeneral from "@/components/AppLayout/General";
import FormForgot from "@/components/Login/FormForgot";

export default function ResetPasswordPage() {
  const { t } = useTranslation(["pages", "common"]);
  return (
    <AppLayoutGeneral>
      <Head>
        <title>ecoTeka · {t("pages.Forgot.EmailCard.title")}</title>
      </Head>
      <FormForgot />
    </AppLayoutGeneral>
  );
}
