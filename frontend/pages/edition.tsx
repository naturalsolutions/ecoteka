import { useEffect, useState, createRef } from "react";
import {
  Grid,
  makeStyles,
  Button,
  Box,
  IconButton,
  Drawer,
  withStyles,
  ButtonGroup,
  InputBase,
} from "@material-ui/core";
import { Search, Filter as FilterIcon } from "@material-ui/icons";
import MapGL, {
  Source,
  Layer,
  FeatureState,
  GeolocateControl,
} from "@urbica/react-map-gl";
import { apiRest } from "@/lib/api";
import { useAppContext } from "@/providers/AppContext";
import { useTemplate } from "@/components/Template";
import { useRouter } from "next/router";
import TreeSummary from "@/components/Tree/Infos/Summary";
import dynamic from "next/dynamic";
import { bbox } from "@turf/turf";
import HighlightOffIcon from "@material-ui/icons/HighlightOff";
import Fuse from "fuse.js";
import "@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw.css";
import MapToolbar, { TMapToolbarAction } from "@/components/Map/Toolbar";
import MapLayers from "@/components/Map/Layers";
import useLocalStorage from "@/lib/hooks/useLocalStorage";
import { useThemeContext } from "@/lib/hooks/useThemeSwitcher";
import { fade } from "@material-ui/core/styles/colorManipulator";

const Draw = dynamic(() => import("@urbica/react-map-gl-draw"), {
  ssr: false,
});

const useStyles = makeStyles(
  ({ direction, spacing, transitions, breakpoints, palette, shape }) => {
    return {
      root: {
        height: "100%",
        position: "relative",
      },
      toolbar: {
        position: "absolute",
        top: 10,
        left: 0,
        width: "calc(100% - 50px)",
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
      search: {
        position: "relative",
        marginRight: 8,
        borderRadius: shape.borderRadius,
        background:
          palette.type === "dark"
            ? palette.background.default
            : palette.grey[200],
        "&:hover": {
          background:
            palette.type === "dark"
              ? palette.background.paper
              : palette.grey[300],
        },
        marginLeft: 0,
        width: "100%",
        [breakpoints.up("sm")]: {
          marginLeft: spacing(1),
          width: "auto",
        },
      },
      searchIconWrapper: {
        width: spacing(6),
        height: "100%",
        position: "absolute",
        pointerEvents: "none",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      },
      searchIcon: {
        color: palette.text.primary,
      },
      inputRoot: {
        color: palette.text.primary,
        width: "100%",
      },
      inputInput: {
        borderRadius: 4,
        paddingTop: spacing(1),
        paddingRight: spacing(direction === "rtl" ? 5 : 1),
        paddingBottom: spacing(1),
        paddingLeft: spacing(direction === "rtl" ? 1 : 5),
        transition: transitions.create("width"),
        width: "100%",
        [breakpoints.up("sm")]: {
          width: 120,
          "&:focus": {
            width: 200,
          },
        },
      },
      toolbarDrawerPaper: {
        pointerEvents: "all",
        minWidth: 200,
        padding: "1rem",
        backgroundColor: fade(palette.background.default, 0.6),
        marginRight: 55,
        height: "calc(100vh - 100px)",
        marginTop: 100,
      },
    };
  }
);

const EditionPage = ({}) => {
  const classes = useStyles();
  const router = useRouter();
  const { dialog } = useTemplate();
  const { user } = useAppContext();
  const mapRef = createRef<MapGL>();
  const { dark } = useThemeContext();
  const geolocateControlRef = createRef<GeolocateControl>();
  const [firstLoad, setFirstLoad] = useLocalStorage("editor:firstLoad", true);
  const [viewport, setViewport] = useLocalStorage("editor:viewport", {
    latitude: 46.7,
    longitude: 2.54,
    zoom: 5,
  });
  const [openToolbarDrawer, setOpenToolbarDrawer] = useState(false);
  const [currentMode, setCurrentMode] = useState<string>("simple_select");
  const [mode, setMode] = useState<string>("simple_select");
  const [data, setData] = useState<any>({
    type: "FeatureCollection",
    features: [],
  });
  const [hoveredTreeId, setHoveredTreeId] = useState<number>(null);
  const [boxSelect, setBoxSelect] = useState<boolean>(false);
  const [filterQuery, setFilterQuery] = useState<string>("");
  const [flteredData, setFilteredData] = useState<any>({
    type: "FeatureCollection",
    features: [],
  });

  const optionsFuse = {
    minMatchCharLength: 3,
    threshold: 0.2,
    distance: 0,
    keys: [
      "properties.properties.gender",
      "properties.properties.specie",
      "properties.properties.vernacularName",
    ],
  };

  const fuse = new Fuse([], optionsFuse);

  const getData = async (organizationId: number) => {
    const newData = await apiRest.organization.geojson(organizationId);
    fuse.setCollection(newData?.features);
    setData(newData);
  };

  useEffect(() => {
    if (user && user.currentOrganization) {
      getData(user.currentOrganization.id);
    }

    return () => {
      if (dialog.current) {
        dialog.current.close();
      }
    };
  }, [user, dialog]);

  useEffect(() => {
    if (filterQuery) {
      const hits = fuse.search(filterQuery);
      if (hits.length > 0) {
        const newFeatures = hits.map((hit) => hit.item);
        setFilteredData((prevState) => {
          return { ...prevState, features: newFeatures };
        });
      } else {
        setFilteredData((prevState) => {
          return { ...prevState, features: [] };
        });
      }
    } else {
      setFilteredData({
        type: "FeatureCollection",
        features: [],
      });
    }
  }, [filterQuery]);

  useEffect(() => {
    if (mapRef.current && data?.features?.length > 0 && firstLoad) {
      try {
        const map = mapRef.current.getMap();
        map.fitBounds(bbox(data));
      } catch (e) {}

      setFirstLoad(false);
    }
  }, [data, mapRef]);

  useEffect(() => {
    if (router.query.tree) {
      apiRest.trees
        .get(user.currentOrganization.id, router.query.tree)
        .then((tree) => {
          openDialog(tree.id);
          mapRef.current.getMap().flyTo({
            zoom: 20,
            center: [tree.x, tree.y],
          });
        });
    }
  }, [router.query.tree]);

  const openDialog = (id) => {
    dialog.current.open({
      title: (
        <Grid container alignItems="flex-end" justify="flex-end">
          <Grid item xs>
            {id}
          </Grid>
          <Grid item>
            <IconButton
              size="small"
              onClick={() => {
                dialog.current.close();
              }}
            >
              <HighlightOffIcon />
            </IconButton>
          </Grid>
        </Grid>
      ),
      content: <TreeSummary id={id} />,
      isDraggable: true,
      dialogProps: {
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
    if (mode !== "simple_select" || boxSelect) {
      return;
    }

    if (event.features.length > 0) {
      openDialog(event.features[0].properties.id);
    }
  };

  const handleFilterChange = (event) => {
    setFilterQuery(event.target.value);
  };

  const DarkButton = withStyles(
    ({ direction, spacing, transitions, breakpoints, palette, shape }) => ({
      root: {
        color: "#fff",
        backgroundColor: "#212121",
        "&:hover": {
          backgroundColor: "#313131",
        },
      },
    })
  )(Button);

  const handleToolbarAction = (action: TMapToolbarAction) => {
    const map = mapRef.current.getMap();

    switch (action) {
      case "zoom_in":
        return map.setZoom(map.getZoom() + 1);
      case "zoom_out":
        return map.setZoom(map.getZoom() - 1);
      case "toggle_layers":
        setOpenToolbarDrawer(!openToolbarDrawer);
        break;
      case "geolocate":
        return geolocateControlRef.current.getControl().trigger();
      case "fit_to_bounds":
        if (data) {
          return map.fitBounds(bbox(data));
        }
        break;
      case "import":
        return router.push("/?panel=import");
    }
  };

  return (
    <Grid className={classes.root} id="map-edition">
      <MapGL
        ref={mapRef}
        style={{ width: "100%", height: "100%" }}
        mapStyle={`/api/v1/maps/style/?theme=${dark ? "dark" : "light"}`}
        latitude={viewport.latitude}
        longitude={viewport.longitude}
        zoom={viewport.zoom}
        onViewportChange={setViewport}
      >
        <Source id="trees" type="geojson" data={data ? data : null} />
        <Source
          id="filteredTrees"
          type="geojson"
          data={flteredData ? flteredData : null}
        />
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
        <Layer
          id="filteredTrees"
          type="circle"
          source="filteredTrees"
          paint={{
            "circle-color": [
              "case",
              ["boolean", ["feature-state", "click"], false],
              "#076ee4",
              "#6015eb",
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
        {boxSelect && (
          <Draw
            // @ts-ignore
            data={data}
            mode={mode}
            lineStringControl={false}
            combineFeaturesControl={false}
            uncombineFeaturesControl={false}
            displayControlsDefault={false}
            boxSelect={boxSelect}
            onDrawCreate={async (item) => {
              if (currentMode === "draw_point") {
                const [x, y] = item.features[0].geometry.coordinates;
                const newTree = {
                  x: x,
                  y: y,
                  properties: {},
                };

                await apiRest.trees.post(user.currentOrganization.id, newTree);
                await getData(user.currentOrganization.id);
              }
            }}
            onDrawDelete={async (selection) => {
              const ids = selection.features.map(
                (feature) => feature.properties.id
              );

              await apiRest.trees.bulkDelete(
                user.currentOrganization.id,
                JSON.stringify(ids)
              );
            }}
            onChange={(newData) => {
              setData(newData);
            }}
            onDrawModeChange={(drawMode) => {
              setMode(drawMode.mode);

              if (currentMode !== "simple_select") {
                setTimeout(() => {
                  setMode(currentMode);
                }, 200);
              }
            }}
          />
        )}
        {hoveredTreeId && (
          <FeatureState
            id={hoveredTreeId}
            source="trees"
            state={{ hover: true }}
          />
        )}
        <GeolocateControl ref={geolocateControlRef} />
      </MapGL>
      <Drawer
        open={openToolbarDrawer}
        hideBackdrop
        anchor="right"
        variant="temporary"
        ModalProps={{
          style: {
            pointerEvents: "none",
          },
        }}
        style={{
          marginRight: 55,
          marginTop: 100,
          height: "calc(100vh - 100px)",
        }}
        PaperProps={{
          elevation: 0,
          className: classes.toolbarDrawerPaper,
        }}
      >
        <MapLayers map={mapRef} />
      </Drawer>
      <MapToolbar onChange={handleToolbarAction} />
      <Box className={classes.toolbar} p={1}>
        <Grid container spacing={2} justify="center" alignItems="center">
          <Grid item xs></Grid>
          <Grid item>
            <ButtonGroup>
              <DarkButton
                onClick={() => {
                  setBoxSelect(false);
                }}
              >
                Information
              </DarkButton>
              <DarkButton
                onClick={() => {
                  setBoxSelect(true);
                  setMode("simple_select");
                  setCurrentMode("simple_select");
                }}
              >
                Selection
              </DarkButton>
              <DarkButton
                onClick={() => {
                  setBoxSelect(true);
                  setMode("draw_point");
                  setCurrentMode("draw_point");
                }}
              >
                + Arbre
              </DarkButton>
              <DarkButton
                disabled
                onClick={() => {
                  setBoxSelect(true);
                  setMode("draw_polygon");
                  setCurrentMode("draw_polygon");
                }}
              >
                + Station
              </DarkButton>
            </ButtonGroup>
          </Grid>
          <Grid item xs></Grid>
          <Grid item>
            <Grid
              container
              direction="column"
              justify="flex-start"
              alignItems="flex-start"
            >
              <Grid item>
                <div className={classes.search}>
                  <div className={classes.searchIconWrapper}>
                    <Search className={classes.searchIcon} />
                  </div>
                  <InputBase
                    placeholder="Filter"
                    value={filterQuery}
                    onChange={handleFilterChange}
                    classes={{
                      root: classes.inputRoot,
                      input: classes.inputInput,
                    }}
                  />
                </div>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Box>
    </Grid>
  );
};

export default EditionPage;
