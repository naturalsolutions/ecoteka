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
} from "@material-ui/core";
import { useAppContext } from "@/providers/AppContext";
import { Lock, Star } from "@material-ui/icons";
import Share from "@material-ui/icons/Share";

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

const OrganizationHeader: FC<OrganizationHeaderProps> = ({}) => {
  const classes = useStyles();
  const { organization } = useAppContext();

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
                  <Lock className={classes.icon} />
                </Grid>
                <Grid item>
                  <Typography variant="caption" color="textSecondary">
                    Privée
                  </Typography>
                </Grid>
              </Grid>
            </Grid>
            <Grid item>
              <Typography variant="caption" color="textPrimary">
                Dernières modifications il y a 8 jours
              </Typography>
            </Grid>
            <Grid item>
              <List>
                <ListItem button>
                  <ListItemIcon>
                    <Star />
                  </ListItemIcon>
                  <ListItemText>
                    {organization?.total_trees} arbres
                  </ListItemText>
                </ListItem>
                <ListItem button>
                  <ListItemIcon>
                    <Star />
                  </ListItemIcon>
                  <ListItemText>56 684 habitants</ListItemText>
                </ListItem>
              </List>
            </Grid>
            <Grid item xs />
            <Grid item>
              <Grid container justify="center" alignItems="center">
                <Grid item>
                  <Button size="large" variant="contained" color="primary">
                    éditeur cartographique
                  </Button>
                </Grid>
                <Grid item xs />
                <Grid item>
                  <Share className={classes.icon} />
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
