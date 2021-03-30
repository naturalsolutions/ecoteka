import { Fab } from "@material-ui/core";
import MyLocationIcon from "@material-ui/icons/MyLocation";
import { makeStyles, Theme, createStyles } from "@material-ui/core/styles";

export interface ETKMapGeolocateFabProps {
  onGeolocate?(): void;
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    fab: {
      background: theme.palette.background.default,
      position: "absolute",
      bottom: theme.spacing(2),
      right: theme.spacing(2),
      display: "none",
      "&:hover": {
        background: theme.palette.secondary.main,
      },
      [theme.breakpoints.up("lg")]: {
        display: "flex",
      },
    },
  })
);

const ETKMapGeolocateFab: React.FC<ETKMapGeolocateFabProps> = ({
  onGeolocate,
}) => {
  const classes = useStyles();

  return (
    <Fab size="small" className={classes.fab} onClick={onGeolocate}>
      <MyLocationIcon fontSize="small" color="primary" />
    </Fab>
  );
};

export default ETKMapGeolocateFab;
