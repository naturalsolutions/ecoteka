import React from "react";
import { Button, ButtonProps } from "@material-ui/core";
import { useTranslation } from "react-i18next";

const ContactButton: React.FC<ButtonProps> = (props) => {
  const { t } = useTranslation(["components", "common"]);

  return (
    <Button
      href="https://www.natural-solutions.eu/creation-de-compte-ecoteka"
      {...props}
    >
      {t("components.Toolbar.about")}
    </Button>
  );
};

export default ContactButton;
