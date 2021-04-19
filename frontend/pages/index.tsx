import { FC, useEffect, useState } from "react";
import AppLayoutGeneral from "@/components/AppLayout/General";
import { useTranslation } from "react-i18next";
import { Typography, Container, Box, Grid, Paper } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { useAppContext } from "@/providers/AppContext";
import TutorialsGallery from "@/components/OrganizationV2/Tutorials";
import DatasetsGallery from "@/components/Home/DatasetsGallery";
import UserOrganizationGallery from "@/components/Home/UserOrganizationGallery";
import CallToLogin from "@/components/Core/CallToActions/CallToLogin";
import AddOrganization from "@/components/Core/CallToActions/AddOrganization";
import MapProvider, { useMapContext } from "@/components/Map/Provider";
import OSMLayer from "@/components/Map/Layers/OSM";

const useStyles = makeStyles(({ spacing }) => ({
  subtitle: {
    marginTop: spacing(8),
    marginBottom: spacing(3),
  },
  tutorialsSection: {
    minHeight: "300px",
  },
}));

const Home: FC = () => {
  const styles = useStyles();
  const { user } = useAppContext();
  const { t } = useTranslation(["common", "components"]);
  const [layers, setLayers] = useState<[]>();

  useEffect(() => {
    if (!layers?.length) {
      const osmLayer = OSMLayer(true);

      setLayers(osmLayer);
    }
  }, [layers]);

  return (
    <AppLayoutGeneral>
      <Container>
        <Typography variant="h4" component="h1" color="textPrimary">
          {t("components.Home.title")}
        </Typography>
        <Box mt={4}>
          <MapProvider layers={layers} borderRadius={20} height={300} />
        </Box>
        <Typography
          variant="h6"
          component="h2"
          className={styles.subtitle}
          color="textPrimary"
        >
          {t("components.Home.myOrganizations")}
        </Typography>
        {!user && <CallToLogin variant="wide" />}
        {user && (
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6} md={3}>
              <AddOrganization />
            </Grid>
            <UserOrganizationGallery variant="insideGrid" />
          </Grid>
        )}
        <Box className={styles.tutorialsSection}>
          <Typography
            variant="h6"
            component="h2"
            className={styles.subtitle}
            color="textPrimary"
          >
            {t("components.Home.exploreSampleDatasets")}
          </Typography>
          <DatasetsGallery />
        </Box>
        <Box className={styles.tutorialsSection} pb={8}>
          <Typography variant="h6" component="h2" className={styles.subtitle}>
            {t("common.tutorials")}
          </Typography>
          <TutorialsGallery />
        </Box>
      </Container>
    </AppLayoutGeneral>
  );
};

export default Home;
