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
    toolbarButton: {
      backgroundColor: theme.palette.background.default,
      color: theme.palette.text.primary,
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
      background: "#fff",
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
    // <Grid className={classes.root}>
    //   <Map styleSource={`/api/v1/maps/style?token=${apiRest.getToken()}`} />
    //   <Box className={classes.toolbar} p={1}>
    //     <Grid container spacing={2} justify="center" alignItems="center">
    //       <Grid item>
    //         <Button variant="outlined" className={classes.toolbarButton}>
    //           Add
    //         </Button>
    //       </Grid>
    //       <Grid item>
    //         <Button variant="outlined" className={classes.toolbarButton}>
    //           Add
    //         </Button>
    //       </Grid>
    //     </Grid>
    //   </Box>
    //   <Box className={classes.background}>dffdsf</Box>
    //   <Box className={classes.sidebar}>
    //     <Grid container>
    //       <Grid item>
    //         <Button variant="outlined" className={classes.toolbarButton}>
    //           Add
    //         </Button>
    //       </Grid>
    //     </Grid>
    //   </Box>

    // </Grid>
    <Calendar />
  );
};

export default EditionPage;
