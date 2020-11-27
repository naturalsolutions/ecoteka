import { useEffect, useState } from "react";
import { Grid, makeStyles, Button, Box } from "@material-ui/core";
import Map from "@/components/Map/Map";
import { apiRest } from "@/lib/api";
import { useTemplate } from "@/components/Template";
import ExpandedDisplay from "@/components/Tree/Infos/Expanded";
import TreeSummary from "@/components/Tree/Infos/Summary";
import TreeAccordion from "@/components/Tree/TreeAccordion";

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
  const [isDialogExpanded, setIsDialogExpanded] = useState(false);
  const [data, setData] = useState(0);
  const { dialog } = useTemplate();

  useEffect(() => {
    if (dialog.current.isOpen()) {
      dialog.current.displayFullScreen(isDialogExpanded);
      dialog.current.setContent(
        !isDialogExpanded ? (
          <TreeSummary id={1} showMore={handleExpandDialog} />
        ) : (
          <ExpandedDisplay id={1} showLess={handleExpandDialog} />
        )
      );
    }
  }, [isDialogExpanded, data]);

  useEffect(() => {
    start(0);
  }, []);

  function start(counter) {
    if (counter < 1000) {
      setData(counter);
      setTimeout(function () {
        counter++;
        start(counter);
      }, 1000);
    }
  }

  function handleExpandDialog() {
    setIsDialogExpanded((current) => !current);
  }

  const openDialog = () => {
    const dialogActions = [
      {
        label: "Fermer",
      },
    ];

    dialog.current.open({
      title: "Tree information",
      content: <TreeSummary id={1} showMore={handleExpandDialog} />,
      actions: dialogActions,
      isDraggable: true,
      dialogProps: {
        maxWidth: "sm",
        fullWidth: true,
        fullScreen: isDialogExpanded,
        disableBackdropClick: true,
        hideBackdrop: true,
        disablePortal: true,
        container: () => document.getElementById("map-edition"),
      },
    });
  };

  return (
    <Grid className={classes.root} id="map-edition">
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
        <Grid container></Grid>
      </Box>
    </Grid>
  );
};

export default EditionPage;
