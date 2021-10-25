import { FC } from "react";
import { useTranslation } from "react-i18next";
import { Paper } from "@material-ui/core";
import { Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/core";
import { Button } from "@material-ui/core";
import { Box } from "@material-ui/core";
import { Grid } from "@material-ui/core";
import { alpha } from "@material-ui/core/styles/colorManipulator";

const useStyles = makeStyles((theme) => ({
  root: {
    background: "url(./background.svg)",
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
    backgroundSize: "cover",
    position: "relative",
    height: "calc(100vh - 100px)",
    [theme.breakpoints.up("md")]: {
      padding: "2rem 1.5rem",
    },
  },
  content: {
    top: 130,
    position: "absolute",
    marginLeft: theme.spacing(2),
    marginRight: theme.spacing(2),
    [theme.breakpoints.up("md")]: {
      top: 180,
      left: 60,
      maxWidth: 650,
      maxHeight: 332,
    },
  },
  paper: {
    background: alpha(theme.palette.background.paper, 0.8),
    padding: "1.5rem 0,75rem",
    [theme.breakpoints.up("md")]: {
      padding: "2rem 1.5rem",
    },
  },
  body: {
    marginBottom: 50,
  },
  button: {
    marginBottom: 26,
    display: "flex",
    alignSelf: "flex-end",
    width: "fit-content",
  },
  box: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-end",
  },
}));

interface HeroProps {
  studioUrl: string;
}

const Hero: FC<HeroProps> = ({ studioUrl }) => {
  const classes = useStyles();
  const { t } = useTranslation();

  return (
    <Grid container alignItems="center" className={classes.root}>
      <Grid item sm={12} md={9} lg={6}>
        <Paper elevation={0} className={classes.paper}>
          <Box p={2} className={classes.box}>
            <Typography component="h1" variant="h2">
              {t("hero.title")}
            </Typography>
            <Typography component="h2" variant="h4" className={classes.body}>
              {t("hero.body")}
            </Typography>
            <Button
              href={studioUrl}
              target="_blank"
              color="primary"
              variant="contained"
              className={classes.button}
            >
              {t("hero.getStarted")}
            </Button>
          </Box>
        </Paper>
      </Grid>
    </Grid>
  );
};

export default Hero;
