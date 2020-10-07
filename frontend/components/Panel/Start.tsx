import React from "react";
import { useRouter } from "next/router";
import {
  makeStyles,
  Grid,
  Typography,
  Box,
  Card,
  CardContent,
  Button,
} from "@material-ui/core";
import { useTranslation } from "react-i18next";
import CardInfoPanel from "../Card/InfoPanel";

export interface ETKPanelStartProps {}

const defaultProps: ETKPanelStartProps = {};

const useStyles = makeStyles(() => ({
  root: {
    maxWidth: "25rem",
    height: "100%",
  },
  card: {
    background: "#b2dfdc",
  },
  cardTitle: {
    fontWeight: "bold",
  },
}));

const ETKPanelStart: React.FC<ETKPanelStartProps> = (props) => {
  const router = useRouter();
  const classes = useStyles();
  const { t } = useTranslation("components");

  return (
    <Box p={2} className={classes.root}>
      <Grid container direction="column" spacing={2} className={classes.root}>
        <Grid item>
          <Typography variant="h5">{t("PanelStart.title")}</Typography>
        </Grid>
        <Grid item>
          <Typography>{t("PanelStart.content")}</Typography>
        </Grid>
        <Grid item>
          <CardInfoPanel
            title={t("PanelStart.numberOfTrees.title")}
            content={`11 ${t("PanelStart.numberOfTrees.content")}`}
          />
        </Grid>
        <Grid item>
          <CardInfoPanel
            title={t("PanelStart.numberOfTreesLayer.title")}
            content={`0 ${t("PanelStart.numberOfTreesLayer.content")}`}
          />
        </Grid>
        <Grid item xs />
        <Grid item>
          <Card className={classes.card}>
            <CardContent>
              <Grid
                container
                direction="column"
                alignItems="center"
                spacing={2}
              >
                <Grid item>
                  <Typography className={classes.cardTitle} variant="h6">
                    {t("PanelStart.card.title")}
                  </Typography>
                </Grid>
                <Grid item>
                  <Typography>{t("PanelStart.card.content")}</Typography>
                </Grid>
                <Grid item>
                  <Box mt={2}>
                    <Button
                      color="secondary"
                      size="large"
                      variant="outlined"
                      onClick={() => {
                        router.push("/?drawer=import");
                      }}
                    >
                      {t("PanelStart.card.button")}
                    </Button>
                  </Box>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

ETKPanelStart.defaultProps = defaultProps;

export default ETKPanelStart;
