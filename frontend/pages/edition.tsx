import { FC, useEffect, useState, createRef } from "react";
import { Grid, makeStyles, Button, Box, Hidden } from "@material-ui/core";
import MapGL, { Source, Layer, FeatureState } from "@urbica/react-map-gl";
import { apiRest } from "@/lib/api";
import { useAppContext } from "@/providers/AppContext";
import Map from "@/components/Map/Map";
import SearchCity from "@/components/Map/SearchCity";
import { useTemplate } from "@/components/Template";
import TreeExpanded from "@/components/Tree/Infos/Expanded";
import TreeSummary from "@/components/Tree/Infos/Summary";
import TreeAccordion from "@/components/Tree/TreeAccordion";
import dynamic from "next/dynamic";

const Draw = dynamic(() => import("@urbica/react-map-gl-draw"), {
  ssr: false,
});

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
  const [isDialogExpanded, setIsDialogExpanded] = useState(false);
  const { dialog } = useTemplate();
  const mapRef = createRef<Map>();
  const { user, isLoading } = useAppContext();
  const [styleSource, setStyleSource] = useState("/api/v1/maps/style");
  const [viewport, setViewport] = useState({
    latitude: 46.7,
    longitude: 2.54,
    zoom: 5,
  });
  const [mode, setMode] = useState<string>("simple_select");
  const [data, setData] = useState<[]>([]);
  const [hoveredTreeId, setHoveredTreeId] = useState(null);
  const [clickedTreeId, setClickedTreeId] = useState(null);

  const getData = async () => {
    const newData = await apiRest.organization.geojson(
      user.currentOrganization.id
    );

    setData(newData);
  };

  useEffect(() => {
    getData();
  }, []);

  useEffect(() => {
    if (dialog.current.isOpen()) {
      dialog.current.displayFullScreen(isDialogExpanded);
      dialog.current.setContent(
        !isDialogExpanded ? (
          <TreeSummary id={clickedTreeId} showMore={handleExpandDialog} />
        ) : (
          <TreeExpanded id={clickedTreeId} showLess={handleExpandDialog} />
        )
      );
    }
  }, [isDialogExpanded]);

  const handleExpandDialog = () => {
    setIsDialogExpanded((current) => !current);
  };

  const handleClose = () => {
    dialog.current.close();
    setIsDialogExpanded(false);
  };

  const openDialog = () => {
    const dialogActions = [
      {
        label: "Fermer",
        onClick: handleClose,
      },
    ];

    dialog.current.open({
      title: "Tree information",
      content: <TreeSummary id={clickedTreeId} showMore={handleExpandDialog} />,
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

  const onHover = (event) => {
    if (event.features.length > 0) {
      const nextHoveredTreeId = event.features[0].id;
      if (hoveredTreeId !== nextHoveredTreeId) {
        setHoveredTreeId(nextHoveredTreeId);
      }
    }
  };

  const onLeave = () => {
    if (hoveredTreeId) {
      setHoveredTreeId(null);
    }
  };

  const onClick = (event) => {
    console.log(event);
    if (event.features.length > 0) {
      const nextClickedTreeId = event.features[0].id;
      console.log(nextClickedTreeId);
      if (clickedTreeId !== nextClickedTreeId) {
        setClickedTreeId(nextClickedTreeId);
      }
      openDialog();
    }
  };

  return (
    <Grid className={classes.root} id="map-edition">
      <MapGL
        ref={mapRef}
        style={{ width: "100%", height: "100%" }}
        mapStyle={styleSource}
        latitude={viewport.latitude}
        longitude={viewport.longitude}
        zoom={viewport.zoom}
        onViewportChange={setViewport}
      >
        <Source id="trees" type="geojson" data={data ? data : null} />
        <Layer
          id="trees"
          type="circle"
          source="trees"
          paint={{
            "circle-color": [
              "case",
              ["boolean", ["feature-state", "click"], false],
              "#076ee4",
              "#ebb215",
            ],
            "circle-stroke-color": "#fff",
            "circle-stroke-width": [
              "case",
              ["boolean", ["feature-state", "click"], false],
              2,
              0,
            ],
            "circle-radius": [
              "case",
              ["boolean", ["feature-state", "hover"], false],
              12,
              5,
            ],
            "circle-pitch-scale": "map",
            "circle-opacity": [
              "case",
              ["boolean", ["feature-state", "hover"], false],
              1,
              0.8,
            ],
          }}
          onHover={onHover}
          onLeave={onLeave}
          onClick={onClick}
        />
        <Draw
          // @ts-ignore
          data={data}
          mode={mode}
          onChange={(newData) => setData(newData)}
          onDrawModeChange={({ mode: newMode }) => setMode(newMode)}
        />
        {hoveredTreeId && (
          <FeatureState
            id={hoveredTreeId}
            source="trees"
            state={{ hover: true }}
          />
        )}
        {clickedTreeId && (
          <FeatureState
            id={clickedTreeId}
            source="trees"
            state={{ click: true }}
          />
        )}
      </MapGL>
      <SearchCity className={classes.mapSearchCity} map={mapRef} />
      <Box className={classes.toolbar} p={1}>
        <Grid container spacing={2} justify="center" alignItems="center">
          <Grid item>
            <Button
              color="primary"
              variant="contained"
              onClick={() => setMode("draw_polygon")}
            >
              + Station
            </Button>
          </Grid>
          <Grid item>
            <Button
              color="primary"
              variant="contained"
              onClick={() => setMode("draw_point")}
            >
              + Arbre
            </Button>
          </Grid>
        </Grid>
      </Box>
    </Grid>
  );
};

export default EditionPage;
