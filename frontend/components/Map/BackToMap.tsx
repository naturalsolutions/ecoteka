import React from "react";
import { Button } from "@material-ui/core";
import { useTranslation } from "react-i18next";
import { useRouter } from "next/router";
import { useAppContext } from "@/providers/AppContext";

const BackToMap: React.FC = () => {
  const { t } = useTranslation();
  const router = useRouter();
  const { organization } = useAppContext();

  const handleOnClick = () => {
    router.push({
      pathname: "/[organizationSlug]/map",
      query: {
        organizationSlug: organization.slug,
      },
    });
  };

  return (
    <Button
      color="primary"
      size="small"
      variant="contained"
      fullWidth
      onClick={handleOnClick}
    >
      {t("common.buttons.backToMap")}
    </Button>
  );
};

export default BackToMap;
