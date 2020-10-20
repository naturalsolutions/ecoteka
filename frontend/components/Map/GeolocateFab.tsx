import { Fab } from "@material-ui/core";
import MyLocationIcon from "@material-ui/icons/MyLocation";
import { makeStyles, Theme, createStyles } from "@material-ui/core/styles";

export interface ETKMapGeolocateFabProps {
  map: any;
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    fab: {
      position: "absolute",
      bottom: theme.spacing(2),
      right: theme.spacing(2),
    },
  })
);

const ETKMapGeolocateFab: React.FC<ETKMapGeolocateFabProps> = (props) => {
  const classes = useStyles();

  return (
    <Fab
      className={classes.fab}
      onClick={async () => {
        await props.map.current?.map.geolocate?.trigger();
      }}
    >
      <MyLocationIcon />
    </Fab>
  );
};

export default ETKMapGeolocateFab;
