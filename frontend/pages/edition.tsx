import { FC, useEffect, useState } from "react";
import { Grid, makeStyles, Button, Box } from "@material-ui/core";
import Map from "@/components/Map/Map";
import { apiRest } from "@/lib/api";
import { useTemplate } from "@/components/Template";
import MiniDisplay from "@/components/Tree/Infos/Mini";

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
  const { dialog } = useTemplate();

  const openDialog = () => {
    const dialogActions = [
      {
        label: "Ferme là",
      },
    ];

    dialog.current.open({
      title: "Ça va bien le dialogue?",
      content: <MiniDisplay />,
      actions: dialogActions,
      isDraggable: true,
      dialogProps: {
        maxWidth: "sm",
        fullWidth: true,
        fullScreen: false,
        disableBackdropClick: true,
      },
    });
  };

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
            <Button color="primary" variant="contained" onClick={openDialog}>
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
