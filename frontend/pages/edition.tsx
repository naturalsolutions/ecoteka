import { FC, useEffect, useState, createRef } from "react";
import { Grid, makeStyles, Button, Box } from "@material-ui/core";
import { apiRest } from "@/lib/api";
import { useAppContext } from "@/providers/AppContext";
import Map from "@/components/Map/Map";
import SearchCity from "@/components/Map/SearchCity";
import { useTemplate } from "@/components/Template";
import MiniDisplay from "@/components/Tree/Infos/Mini";
import ExpandedDisplay from "@/components/Tree/Infos/Expanded";

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
    mapSearchCity: {
      position: "absolute",
      top: "1rem",
      right: "1rem",
      width: "300px",
    },
  };
});

const EditionPage = ({}) => {
  const classes = useStyles();
  const [sidebar, setSidebar] = useState();
  const [isDialogExpanded, setIsDialogExpanded] = useState(false);
  const [data, setData] = useState(0);
  const { dialog } = useTemplate();
  const mapRef = createRef<Map>();
  const { user, isLoading } = useAppContext();
  const [styleSource, setStyleSource] = useState("/api/v1/maps/style");

  useEffect(() => {
    if (dialog.current.isOpen()) {
      dialog.current.displayFullScreen(isDialogExpanded);
      dialog.current.setContent(
        !isDialogExpanded ? (
          <MiniDisplay data={data} showMore={handleExpandDialog} />
        ) : (
          <ExpandedDisplay data={data} showLess={handleExpandDialog} />
        )
      );
    }
  }, [isDialogExpanded, data]);

  // useEffect(() => {}, []);

  useEffect(() => {
    if (user) {
      if (user.currentOrganization) {
        setStyleSource(
          `/api/v1/maps/style?token=${apiRest.getToken()}&organization_id=${
            user.currentOrganization.id
          }`
        );
      }
    } else {
      setStyleSource("/api/v1/maps/style");
    }
  }, [isLoading, user, mapRef]);

  useEffect(() => {
    mapRef.current.map.setStyle(styleSource);
  }, [styleSource]);

  useEffect(() => {
    mapRef?.current?.map.on("click", onClick);
    return () => {
      mapRef?.current?.map.off("click", onClick);
    };
  }, [mapRef]);

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
      content: <MiniDisplay showMore={handleExpandDialog} />,
      actions: dialogActions,
      isDraggable: true,
      dialogProps: {
        maxWidth: "sm",
        fullWidth: true,
        fullScreen: isDialogExpanded,
        disableBackdropClick: true,
        hideBackdrop: true,
      },
    });
  };

  const onClick = (e) => {
    const rendererFeatures = mapRef.current?.map?.queryRenderedFeatures(
      e.point
    );
    let features = [];

    if (rendererFeatures) {
      features = rendererFeatures?.filter((f) => {
        console.log(f);
        return f.layer["id"].includes("ecoteka");
      });

      if (features.length > 0) {
        const feature = features.pop();

        console.log(feature.properties);
        console.log(feature.geometry.coordinates);
      }
    }
  };

  return (
    <Grid className={classes.root} id="map-edition">
      <Map ref={mapRef} styleSource={styleSource} />
      <SearchCity className={classes.mapSearchCity} map={mapRef} />
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
    </Grid>
  );
};

export default EditionPage;
