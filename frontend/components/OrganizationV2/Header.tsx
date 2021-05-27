import { FC } from "react";
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
  IconButton,
} from "@material-ui/core";
import { useAppContext } from "@/providers/AppContext";
import { Lock, Nature, Public, Backup } from "@material-ui/icons";
import Share from "@material-ui/icons/Share";
import { useTranslation } from "react-i18next";
import { format, formatDistance, formatRelative, subDays } from "date-fns";
import { es, enGB, fr } from "date-fns/locale";
import { useRouter } from "next/router";

export interface OrganizationHeaderProps {}

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

const OrganizationHeader: FC<OrganizationHeaderProps> = ({}) => {
  const classes = useStyles();
  const { organization } = useAppContext();
  const { t } = useTranslation(["common", "components"]);
  const router = useRouter();

  return (
    <Paper className={classes.root}>
      <Grid container spacing={2} alignItems="stretch">
        <Grid item>
          <CardMedia
            className={classes.media}
            component="img"
            image={`/osm_thumbnails/thumbnail/${organization?.osm_id}?width=700&height=300&padding=30`}
            title={organization?.name}
          />
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
                <ListItem button>
                  <ListItemIcon>
                    <Nature />
                  </ListItemIcon>
                  <ListItemText>
                    {organization?.total_trees} arbres
                  </ListItemText>
                </ListItem>
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
                    {t("components.Organization.Header.mapEditor")}
                  </Button>
                </Grid>
                <Grid item xs />
                <Grid item>
                  <Button
                    href={`/${organization.slug}/map?panel=import`}
                    color="primary"
                  >
                    {t("components.Organization.Header.importDataset")}
                  </Button>
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
