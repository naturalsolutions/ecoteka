import { FC, useEffect, useState } from "react";
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
import CardInfoPanel from "@/components/Card/InfoPanel";
import { useRouter } from "next/router";
import Can from "@/components/Can";
import { useAppContext } from "@/providers/AppContext";
import { AppLayoutCartoDialog } from "@/components/AppLayout/Carto";
import BackToMap from "@/components/Map/BackToMap";
import OrganizationProgress from "@/components/OrganizationV2/Progress";
import SpeciesDiversityDashboard from "@/components/OrganizationV2/Dashboards/SpeciesDiversityDashboard";

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

const PanelStartGeneralInfo: FC<{ numberOfTrees?: number }> = ({
  numberOfTrees = 0,
}) => {
  const router = useRouter();
  const classes = useStyles();
  const { t } = useTranslation("components");
  const { organization } = useAppContext();
  const [active, setActive] = useState<boolean>(false);

  useEffect(() => {
    const { query, route } = router;

    if (route === "/[organizationSlug]/map" && query.panel === "start") {
      setActive(true);
    } else {
      setActive(false);
    }
  }, [router.query]);

  return (
    active && (
      <AppLayoutCartoDialog
        title={t("components.PanelStart.title")}
        actions={<BackToMap />}
      >
        <Grid
          container
          direction="column"
          spacing={2}
          className={classes.root}
          wrap="nowrap"
        >
          <Grid item>
            <OrganizationProgress />
          </Grid>
          <Grid item>
            <SpeciesDiversityDashboard />
          </Grid>
          <Grid item>
            <CardInfoPanel
              title={t("components.PanelStart.numberOfTrees.title")}
              content={`14.5 ${t(
                "components.PanelStart.numberOfTrees.content"
              )}`}
            />
          </Grid>
          <Grid item>
            <CardInfoPanel
              title={t("components.PanelStart.numberOfTreesLayer.title")}
              content={`${numberOfTrees} ${t(
                "components.PanelStart.numberOfTreesLayer.content"
              )}`}
            />
          </Grid>
          <Grid item xs />
          <Can do="create" on="Trees">
            <Grid item>
              <Card className={classes.card}>
                <CardContent>
                  <Grid
                    container
                    wrap="nowrap"
                    direction="column"
                    alignItems="center"
                    spacing={2}
                  >
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
                            router.push({
                              pathname: "/[organizationSlug]/map",
                              query: {
                                panel: "import",
                                organizationSlug: organization.slug,
                              },
                            });
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
          </Can>
        </Grid>
      </AppLayoutCartoDialog>
    )
  );
};

export default PanelStartGeneralInfo;
