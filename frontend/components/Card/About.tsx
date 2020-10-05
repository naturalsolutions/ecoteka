import React from "react";
import { makeStyles, Card, Typography, Button } from "@material-ui/core";
import { useTranslation } from "react-i18next";

export interface ETKCardAboutProps {}

const defaultProps: ETKCardAboutProps = {};

const useStyles = makeStyles(() => ({
  root: {},
}));

const ETKCardAbout: React.FC<ETKCardAboutProps> = (props) => {
  const classes = useStyles();
  const { t } = useTranslation("components");

  return (
    <Card>
      <Typography>{t("CardAbout.title")}</Typography>
      <Typography>{t("CardAbout.content")}</Typography>
      <Button>{t("CardAbout.button")}</Button>
    </Card>
  );
};

ETKCardAbout.defaultProps = defaultProps;

export default ETKCardAbout;
