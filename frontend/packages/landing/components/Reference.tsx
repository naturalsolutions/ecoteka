import { FC } from "react";
import {
  makeStyles,
  Button,
  Avatar,
  Typography,
  Paper,
} from "@material-ui/core";
import { EcotekaTheme } from "@/theme/config";
import { useTranslation } from "react-i18next";

export interface TestimonyProps {
  src: string;
  alt?: string;
  title: string;
  content: string;
}

const useStyles = makeStyles((theme: EcotekaTheme) => ({
  root: {
    marginBottom: "2rem",
    display: "flex",
    padding: "31px 38px",
    flexDirection: "column",
    [theme.breakpoints.up("md")]: {
      flexDirection: "row",
    },
    backgroundColor: "transparent",
  },
  avatar: {
    flex: 1,
    width: "100%",
    height: "100%",
    marginBottom: 35,
    [theme.breakpoints.up("md")]: {
      flex: "none",
      marginBottom: 0,
      marginRight: 40,
      width: 180,
    },
  },
  content: {
    flex: 1,
    marginRight: "50px",
  },
  title: {
    marginBottom: 16,
  },
  text: {
    color: theme.palette.getContrastText(theme.palette.background.dark),
    marginBottom: "10px",
  },
  hubspot: {
    display: "flex",
    flexDirection: "column",
  },
  hub: {
    width: "80px",
    alignSelf: "flex-end",
  },
}));

const Testimony: FC<TestimonyProps> = ({ src, alt = "", title, content }) => {
  const classes = useStyles();
  const { t } = useTranslation();

  return (
    <Paper className={classes.root} elevation={0}>
      <Avatar alt={alt} src={src} className={classes.avatar} />
      <div className={classes.content}>
        <Typography
          component="div"
          variant="subtitle2"
          className={classes.title}
        >
          {title}
        </Typography>
        <Typography component="div" variant="body1">
          {content}
        </Typography>
      </div>
      <div className={classes.hubspot}>
        <a
          href="https://meetings.hubspot.com/manon_fredout"
          target="_blank"
          rel="noreferrer"
        >
          <Button color="primary" variant="contained" className={classes.text}>
            {t("homePage.reference.button")}
          </Button>
        </a>
        <img
          className={classes.hub}
          src={t("homePage.reference.hubspot")}
          alt="HubSpotLogo"
        />
      </div>
    </Paper>
  );
};

export default Testimony;
