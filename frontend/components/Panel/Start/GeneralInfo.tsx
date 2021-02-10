import { FC } from "react";
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
import { useAppContext } from "@/providers/AppContext";
import CardInfoPanel from "@/components/Card/InfoPanel";
import { useRouter } from "next/router";

const useStyles = makeStyles((theme) => ({
  root: {
    height: "100%",
  },
  card: {
    backgroundColor: theme.palette.secondary.main,
  },
  cardTitle: {
    fontWeight: "bold",
  },
}));

const ETKPanelStartGeneralInfo: FC = () => {
  const router = useRouter();
  const classes = useStyles();
  const { user } = useAppContext();
  const { t } = useTranslation("components");

  return (
    <Grid container direction="column" spacing={2} className={classes.root}>
      <Grid item>
        <Typography variant="h5">{t("components.PanelStart.title")}</Typography>
      </Grid>
      <Grid item>
        <Typography>{t("components.PanelStart.content")}</Typography>
      </Grid>
      <Grid item>
        <CardInfoPanel
          title={t("components.PanelStart.numberOfTrees.title")}
          content={`14.5 ${t("components.PanelStart.numberOfTrees.content")}`}
        />
      </Grid>
      <Grid item>
        <CardInfoPanel
          title={t("components.PanelStart.numberOfTreesLayer.title")}
          content={`${user?.currentOrganization?.total_trees || 0} ${t(
            "components.PanelStart.numberOfTreesLayer.content"
          )}`}
        />
      </Grid>
      <Grid item xs />
      <Grid item>
        <Card className={classes.card}>
          <CardContent>
            <Grid container direction="column" alignItems="center" spacing={2}>
              <Grid item>
                <Typography className={classes.cardTitle} variant="h6">
                  {t("components.PanelStart.card.title")}
                </Typography>
              </Grid>
              <Grid item>
                <Typography>
                  {t("components.PanelStart.card.content")}
                </Typography>
              </Grid>
              <Grid item>
                <Box mt={2}>
                  <Button
                    color="primary"
                    size="large"
                    variant="outlined"
                    onClick={() => {
                      router.push("/map/?panel=import");
                    }}
                  >
                    {t("components.PanelStart.card.button")}
                  </Button>
                </Box>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
};

export default ETKPanelStartGeneralInfo;
