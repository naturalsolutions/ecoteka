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
      size="small"
      className={classes.fab}
      color="primary"
      onClick={async () => {
        console.log(props.map.current.geolocate);
        await props.map.current?.geolocate?.trigger();
      }}
    >
      <MyLocationIcon />
    </Fab>
  );
};

export default ETKMapGeolocateFab;
