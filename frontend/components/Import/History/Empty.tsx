import React from "react";
import { makeStyles, Grid, Typography, Button } from "@material-ui/core";
import { useTranslation, Trans } from "react-i18next";

export interface ETKImportHistoryEmptyProps {}

const defaultProps: ETKImportHistoryEmptyProps = {};

const useStyles = makeStyles(() => ({
  content: {
    fontSize: "1.5rem",
    fontStyle: "italic",
    fontWeight: "bold",
    letterSpacing: "2px",
    color: "grey",
  },

  GridEmpty: {
    background: `no-repeat center url('https://image.freepik.com/vecteurs-libre/jeune-femme-afro-personnage-avatar-du-paysage_25030-29987.jpg')`,
    backgroundSize: "contain",
    minHeight: "500px",
    paddingTop: "50px",
  },
}));

const ETKImportHistoryEmpty: React.FC<ETKImportHistoryEmptyProps> = (props) => {
  const classes = useStyles();
  const { t } = useTranslation("components");

  return (
    <Grid
      container
      direction="column"
      justify="flex-start"
      alignItems="center"
      spacing={2}
      className={classes.GridEmpty}
    >
      <Grid item>
        <Typography paragraph align="center" className={classes.content}>
          <Trans>{t("ImportHistoryEmpty.content")}</Trans>
        </Typography>
      </Grid>
      <Grid item>
        <Button variant="contained" color="secondary" size="large">
          {t("ImportHistoryEmpty.button")}
        </Button>
      </Grid>
    </Grid>
  );
};

ETKImportHistoryEmpty.defaultProps = defaultProps;

export default ETKImportHistoryEmpty;
