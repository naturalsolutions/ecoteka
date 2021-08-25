import { FC, useContext } from "react";
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
  useMediaQuery,
  useTheme,
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

export interface OrganizationHeaderProps {}
export interface MapPreviewProps {}

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    padding: 24,
    marginBottom: theme.spacing(2),
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
  mapPreview: {
    height: "unset",
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
  [theme.breakpoints.up("sm")]: {
    mapPreview: {
      height: 260,
    },
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

export const MapPreview: FC<MapPreviewProps> = ({}) => {
  const classes = useStyles();
  const { organization } = useAppContext();

  if (organization.total_trees == 0 && !organization.osm_id) {
    return <Box className={classes.mapPreviewDefault} />;
  }

  return (
    <CardMedia
      className={classes.media}
      component="img"
      image={`/osm_thumbnails/thumbnail/${
        organization?.osm_id
      }?organizationId=${organization.id}&template=${
        organization.total_trees > 50000 ? "osm" : "ecoteka"
      }&width=700&height=300`}
      title={organization?.name}
    />
  );
};

const OrganizationHeader: FC<OrganizationHeaderProps> = ({}) => {
  const classes = useStyles();
  const { organization } = useAppContext();
  const { t } = useTranslation(["common", "components"]);
  const ability = useContext(AbilityContext);
  const router = useRouter();
  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up("sm"));

  return (
    <Paper className={classes.root} elevation={isDesktop ? 1 : 0}>
      <Grid container direction="column">
        <Grid item>
          <Grid container alignItems="center" spacing={1}>
            <Grid item>
              <Typography variant="h3">{organization?.name}</Typography>
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
            {formatDistance(Date.parse(organization.updated_at), new Date(), {
              addSuffix: true,
              locale: setDateLocale(router.locale),
            })}
          </Typography>
        </Grid>
      </Grid>
      <Grid container spacing={2} alignItems="stretch">
        <Grid item xs={12} sm={6} className={classes.mapPreview}>
          <MapPreview />
        </Grid>
        <Grid item xs={12} sm={6}>
          <Grid container direction="column" className={classes.right}>
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
              <Grid
                container
                direction={isDesktop ? "row" : "column"}
                justify="center"
                alignItems="center"
              >
                <Grid item>
                  <Button
                    size="large"
                    variant="contained"
                    fullWidth
                    color="primary"
                    onClick={() => router.push(`/${organization.slug}/map`)}
                  >
                    {ability.can("manage", "Trees")
                      ? t("components.Organization.Header.mapEditor")
                      : t("components.Organization.Header.treesExplorer")}
                  </Button>
                </Grid>
                <Grid item xs />
                <Can do="manage" on="Trees">
                  <Grid item>
                    <Button
                      href={`/${organization.slug}/map?panel=import`}
                      fullWidth
                      color="primary"
                    >
                      {t("components.Organization.Header.importDataset")}
                    </Button>
                  </Grid>
                </Can>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Paper>
  );
};

export default OrganizationHeader;
