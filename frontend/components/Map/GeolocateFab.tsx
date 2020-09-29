import { Fab } from "@material-ui/core";
import { MyLocation as MyLocationIcon } from "@material-ui/icons";
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
      color="primary"
      onClick={async () => {
        await props.map.current?.geolocate?.trigger();
      }}
    >
      <MyLocationIcon />
    </Fab>
  );
};

export default ETKMapGeolocateFab;
