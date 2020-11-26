import { FC, useState } from "react";
import { Grid, makeStyles, Button, Box } from "@material-ui/core";
import Map from "@/components/Map/Map";
import { apiRest } from "@/lib/api";
import Calendar from "@/components/Calendar/Index";

const useStyles = makeStyles((theme) => {
  return {
    root: {
      height: "100%",
      position: "relative",
    },
    toolbar: {
      position: "absolute",
      top: 0,
      left: 0,
      width: "100%",
    },
    sidebar: {
      position: "absolute",
      top: 0,
      right: 0,
      height: "100%",
    },
    background: {
      position: "absolute",
      top: 0,
      right: 0,
      background: "#0D1821",
      height: "100%",
      width: "300px",
    },
    calendar: {
      height: "100%",
    },
  };
});

const EditionPage = ({}) => {
  const classes = useStyles();
  const [sidebar, setSidebar] = useState();

  return (
    <Grid className={classes.root}>
      <Map styleSource={`/api/v1/maps/style?token=${apiRest.getToken()}`} />
      <Box className={classes.toolbar} p={1}>
        <Grid container spacing={2} justify="center" alignItems="center">
          <Grid item>
            <Button color="primary" variant="contained">
              + Station
            </Button>
          </Grid>
          <Grid item>
            <Button color="primary" variant="contained">
              + Arbre
            </Button>
          </Grid>
        </Grid>
      </Box>
      <Box className={classes.background}></Box>
      <Box className={classes.sidebar}>
        <Grid container>
          <Grid item></Grid>
        </Grid>
      </Box>
    </Grid>
  );
};

export default EditionPage;
