import { FC, useEffect, useState } from "react";
import { makeStyles, Grid } from "@material-ui/core";
import { useTranslation } from "react-i18next";
import { useRouter } from "next/router";
import { AppLayoutCartoDialog } from "@/components/AppLayout/Carto";
import BackToMap from "@/components/Map/BackToMap";
import OrganizationProgress from "@/components/OrganizationV2/Progress";
import SpeciesDiversityDashboard from "@/components/OrganizationV2/Dashboards/SpeciesDiversityDashboard";

const useStyles = makeStyles((theme) => ({
  root: {
    height: "100%",
  },
}));

const PanelStartGeneralInfo: FC = () => {
  const router = useRouter();
  const classes = useStyles();
  const { t } = useTranslation("components");
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
        </Grid>
      </AppLayoutCartoDialog>
    )
  );
};

export default PanelStartGeneralInfo;
