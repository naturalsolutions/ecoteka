import React from "react";
import {
  Button,
  ButtonProps,
  BottomNavigationAction,
  useMediaQuery,
} from "@material-ui/core";
import { useTranslation } from "react-i18next";
import { useThemeContext } from "@/lib/hooks/useThemeSwitcher";

const ContactButton: React.FC<ButtonProps> = (props) => {
  const { t } = useTranslation(["components", "common"]);
  const { theme } = useThemeContext();
  const matches = useMediaQuery(theme.breakpoints.down("md"));

  return matches ? (
    <BottomNavigationAction
      label={t("Toolbar.about")}
      href="https://www.natural-solutions.eu/creation-de-compte-ecoteka"
      {...props}
    />
  ) : (
    <Button
      href="https://www.natural-solutions.eu/creation-de-compte-ecoteka"
      {...props}
    >
      {t("Toolbar.about")}
    </Button>
  );
};

export default ContactButton;
