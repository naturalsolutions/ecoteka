import { Fab } from "@material-ui/core";
import MyLocationIcon from "@material-ui/icons/MyLocation";
import { makeStyles, Theme, createStyles } from "@material-ui/core/styles";

export interface ETKMapGeolocateFabProps {
  map: any;
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    fab: {
      background: theme.palette.background.default,
      position: "absolute",
      bottom: theme.spacing(2),
      right: theme.spacing(8),
    },
  })
);

const ETKMapGeolocateFab: React.FC<ETKMapGeolocateFabProps> = (props) => {
  const classes = useStyles();

  return (
    <Fab
      size="small"
      className={classes.fab}
      onClick={async () => {
        await props.map.current?.map.geolocate?.trigger();
      }}
    >
      <MyLocationIcon fontSize="small" color="primary" />
    </Fab>
  );
};

export default ETKMapGeolocateFab;
