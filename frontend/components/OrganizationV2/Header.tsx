import { FC, useContext, useEffect } from "react";
import {
  makeStyles,
  Theme,
  Paper,
  Grid,
  CardMedia,
  Typography,
  Button,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Box,
} from "@material-ui/core";
import { useAppContext } from "@/providers/AppContext";
import {
  Lock,
  Nature,
  Public,
  SupervisedUserCircleTwoTone,
  ZoomOutMap,
} from "@material-ui/icons";
import { useTranslation } from "react-i18next";
import { formatDistance } from "date-fns";
import { es, enGB, fr } from "date-fns/locale";
import { useRouter } from "next/router";
import Can, { AbilityContext } from "@/components/Can";
import MapProvider, { useMapContext } from "@/components/Map/Provider";
import OSMLayer from "@/components/Map/Layers/OSM";
import useApi from "@/lib/useApi";
import { FlyToInterpolator } from "@deck.gl/core";

export interface OrganizationHeaderProps {}
export interface MapPreviewProps {}

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    padding: 24,
  },
  icon: {
    color: theme.palette.text.secondary,
  },
  right: {
    height: "100%",
  },
  media: {
    backgroundColor: theme.palette.text.secondary,
  },
  mapPreviewDefault: {
    backgroundColor: theme.palette.text.secondary,
    width: "700px",
    height: "300px",
  },
  map: {
    width: "700px",
    height: "300px",
  },
}));

const setDateLocale = (locale: string) => {
  switch (locale) {
    case "fr":
      return fr;
    case "en":
      return enGB;
    case "es":
      return es;
    default:
      return fr;
  }
};

const defaultViewState = {
  longitude: 2.54,
  latitude: 46.7,
  zoom: 5,
};

const layers = [OSMLayer({ visible: true })];

const MapData: FC<MapPreviewProps> = ({}) => {
  const { viewState, setViewState } = useMapContext();
  const { apiETK } = useApi().api;
  const { organization } = useAppContext();

  const fitToBounds = async (organizationId: number) => {
    try {
      const { status, data: bbox } = await apiETK.get(`/maps/bbox`, {
        params: {
          organization_id: organizationId,
        },
      });

      if (status === 200 && bbox.xmin && bbox.ymin && bbox.xmax && bbox.ymax) {
        const newViewState = layers[0].context.viewport.fitBounds(
          [
            [bbox.xmin, bbox.ymin],
            [bbox.xmax, bbox.ymax],
          ],
          {
            padding: 100,
          }
        );
        setViewState({
          ...newViewState,
          transitionDuration: 1000,
          transitionInterpolator: new FlyToInterpolator(),
        });
      } else {
        setViewState({
          ...viewState,
          transitionDuration: 1000,
          transitionInterpolator: new FlyToInterpolator(),
        });
      }
    } catch (e) {}
  };

  useEffect(() => {
    if (organization) {
      // if (dataOrganizationId !== organization.id) {
      //   if (dataOrganizations[organization.id]?.features.length > 0) {
      //     setDataOrganizationId(organization.id);
      //     setData(dataOrganizations[organization.id]);
      //   } else {
      //     getData(organization.id);
      //   }
      // }
      fitToBounds(organization.id);
    }
  }, []);

  useEffect(() => {
    if (organization) {
      // if (dataOrganizationId !== organization.id) {
      //   if (dataOrganizations[organization.id]?.features.length > 0) {
      //     setDataOrganizationId(organization.id);
      //     setData(dataOrganizations[organization.id]);
      //   } else {
      //     getData(organization.id);
      //   }
      // }
      fitToBounds(organization.id);
    }
  }, [organization]);

  return <></>;
};

export const MapPreview: FC<MapPreviewProps> = ({}) => {
  const classes = useStyles();
  const { organization } = useAppContext();
  if (organization.total_trees == 0 && organization.osm_id) {
    return (
      <CardMedia
        className={classes.media}
        component="img"
        image={`/osm_thumbnails/thumbnail/${organization?.osm_id}?width=700&height=300&padding=30`}
        title={organization?.name}
      />
    );
  }
  if (organization.total_trees == 0 && !organization.osm_id) {
    return <Box className={classes.mapPreviewDefault} />;
  }
  if (organization.total_trees > 0) {
    return (
      <MapProvider
        PaperProps={{ elevation: 0 }}
        layers={layers}
        height={"300px"}
        width={"700px"}
      >
        <MapData />
      </MapProvider>
    );
  }
  return <div>Error!</div>;
};

const OrganizationHeader: FC<OrganizationHeaderProps> = ({}) => {
  const classes = useStyles();
  const { organization } = useAppContext();
  const { t } = useTranslation(["common", "components"]);
  const ability = useContext(AbilityContext);
  const router = useRouter();

  return (
    <Paper className={classes.root}>
      <Grid container spacing={2} alignItems="stretch">
        <Grid item xs>
          <MapPreview />
        </Grid>
        <Grid item xs>
          <Grid container direction="column" className={classes.right}>
            <Grid item>
              <Grid container alignItems="center" spacing={1}>
                <Grid item>
                  <Typography variant="subtitle2">
                    {organization?.name}
                  </Typography>
                </Grid>
                <Grid item>
                  {organization.mode == "private" ? (
                    <Lock className={classes.icon} />
                  ) : (
                    <Public className={classes.icon} />
                  )}
                </Grid>
                <Grid item>
                  <Typography variant="caption" color="textSecondary">
                    {t(`components.Organization.modes.${organization.mode}`)}
                  </Typography>
                </Grid>
              </Grid>
            </Grid>
            <Grid item>
              <Typography variant="caption" color="textPrimary">
                {t("components.organization.Header.lastUpdatedAt")}{" "}
                {formatDistance(
                  Date.parse(organization.updated_at),
                  new Date(),
                  {
                    addSuffix: true,
                    locale: setDateLocale(router.locale),
                  }
                )}
              </Typography>
            </Grid>
            <Grid item>
              <List>
                <ListItem>
                  <ListItemIcon>
                    <Nature />
                  </ListItemIcon>
                  <ListItemText>
                    {organization?.total_trees.toLocaleString(router.locale)}{" "}
                    {t("components.organization.Header.tree", {
                      count: organization?.total_trees,
                    })}
                  </ListItemText>
                </ListItem>
                {organization?.population_size && (
                  <ListItem>
                    <ListItemIcon>
                      <SupervisedUserCircleTwoTone />
                    </ListItemIcon>
                    <ListItemText>
                      {organization?.population_size.toLocaleString(
                        router.locale
                      )}{" "}
                      {t("components.organization.Header.populationSize")}
                    </ListItemText>
                  </ListItem>
                )}
                {organization?.area_sq_km && (
                  <ListItem>
                    <ListItemIcon>
                      <ZoomOutMap />
                    </ListItemIcon>
                    <ListItemText>
                      {organization?.area_sq_km.toLocaleString(router.locale)}{" "}
                      km2
                    </ListItemText>
                  </ListItem>
                )}
              </List>
            </Grid>
            <Grid item xs />
            <Grid item>
              <Grid container justify="center" alignItems="center">
                <Grid item>
                  <Button
                    size="large"
                    variant="contained"
                    color="primary"
                    onClick={() => router.push(`/${organization.slug}/map`)}
                  >
                    {ability.can("manage", "Trees")
                      ? t("components.Organization.Header.mapEditor")
                      : t("components.Organization.Header.treesExplorer")}
                  </Button>
                </Grid>
                <Grid item xs />
                <Grid item>
                  <Can do="manage" on="Trees">
                    <Button
                      href={`/${organization.slug}/map?panel=import`}
                      color="primary"
                    >
                      {t("components.Organization.Header.importDataset")}
                    </Button>
                  </Can>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Paper>
  );
};

export default OrganizationHeader;
