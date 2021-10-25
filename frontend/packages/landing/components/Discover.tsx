import { FC } from "react";
import { makeStyles, Avatar, Typography, Paper } from "@material-ui/core";
import { HubButton } from "@ecoteka/core";
import { EcotekaTheme } from "@/theme/config";
import { useTranslation } from "react-i18next";

const useStyles = makeStyles((theme: EcotekaTheme) => ({
  root: {
    marginBottom: "2rem",
    display: "flex",
    padding: "31px 38px",
    flexDirection: "column",
    backgroundColor: "transparent",
  },
  title: {
    marginBottom: 16,
  },
  text: {
    color: theme.palette.getContrastText(theme.palette.background.dark),
    marginBottom: "10px",
  },
  bot: {
    marginBottom: "20px",
    textAlign: "center",
  },
}));

export interface DiscoverProps {
  title: string;
}

const Discover: FC<DiscoverProps> = ({ title }) => {
  const classes = useStyles();
  const { t } = useTranslation();

  return (
    <Paper className={classes.root} elevation={0}>
      <Typography className={classes.bot} variant="body1">
        {title}
      </Typography>
      <HubButton
        message={t("homePage.discover.button")}
        variant="contained"
        buttonClassName={classes.text}
        formId="acf66ccc-3f02-41ac-8efa-005757f27d52"
        color="primary"
      />
    </Paper>
  );
};

export default Discover;
