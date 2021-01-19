import { useEffect, useState, createRef } from "react";
import { Grid, makeStyles, Box } from "@material-ui/core";
import { v4 as uuidv4 } from "uuid";
import MapGL, {
  Source,
  Layer,
  FeatureState,
  GeolocateControl,
} from "@urbica/react-map-gl";
import { apiRest } from "@/lib/api";
import { useAppContext } from "@/providers/AppContext";
import { useAppLayout } from "@/components/AppLayout/Base";
import { useRouter } from "next/router";
import TreeSummary from "@/components/Tree/Infos/Summary";
import dynamic from "next/dynamic";
import { bbox } from "@turf/turf";
import Fuse from "fuse.js";
import "@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw.css";
import { TMapToolbarAction } from "@/components/Map/Toolbar";
import MapLayers from "@/components/Map/Layers";
import MapFilter from "@/components/Map/Filter";
import useLocalStorage from "@/lib/hooks/useLocalStorage";
import { useThemeContext } from "@/lib/hooks/useThemeSwitcher";
import AppLayoutCarto from "@/components/AppLayout/Carto";
import PanelStartGeneralInfo from "@/components/Panel/Start/GeneralInfo";
import MapModeSwitch from "@/components/Map/ModeSwitch";
import MapDrawToolbar from "@/components/Map/DrawToolbar";
import MapSearchCity from "@/components/Map/SearchCity";

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
    };
  }
);

const EditionPage = ({}) => {
  const classes = useStyles();
  const router = useRouter();
  const { dialog } = useAppLayout();
  const { user } = useAppContext();
  const { dark } = useThemeContext();
  const [drawerLeftComponent, setDrawerLeftComponent] = useState(
    <PanelStartGeneralInfo />
  );
  const [drawerRightComponent, setDrawerRightComponent] = useState(null);
  const mapRef = createRef<MapGL>();
  const geolocateControlRef = createRef<GeolocateControl>();
  const [firstLoad, setFirstLoad] = useLocalStorage(
    "etk:editor:firstLoad",
    true
  );
  const [viewport, setViewport] = useLocalStorage("etk:editor:viewport", {
    latitude: 46.7,
    longitude: 2.54,
    zoom: 5,
  });
  const [currentMode, setCurrentMode] = useState<string>("simple_select");
  const [mode, setMode] = useState<string>("simple_select");
  const [data, setData] = useState<any>({
    type: "FeatureCollection",
    features: [],
  });
  const [selection, setSelection] = useState([]);
  const [hoveredTreeId, setHoveredTreeId] = useState<number>(null);
  const [boxSelect, setBoxSelect] = useState<boolean>(false);
  const [filterQuery, setFilterQuery] = useState<string>("");
  const [filteredData, setFilteredData] = useState<any>({
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

  const fuse = new Fuse(data?.features, optionsFuse);

  const getData = async (
    organizationId: number,
    fitBounds: boolean = false
  ) => {
    const newData = await apiRest.organization.geojson(organizationId);
    setData(newData);
  };

  const handleOnTreeSave = (record) => {
    const index = data.features.findIndex((f) => f.properties.id === record.id);
    const newData = { ...data };

    if (index && newData.features[index]) {
      newData.features[index].properties = record;
      setData(newData);
    }
  };

  const onWSMessage = (message) => {
    if (message && message.data) {
      try {
        const json = JSON.parse(message.data);

        if (json.data.organization_id !== user.currentOrganization.id) {
          return;
        }

        if (!json.data.data.action) {
          return;
        }

        getData(user.currentOrganization.id);
      } catch (e) {}
    }
  };

  useEffect(() => {
    fuse.setCollection(data?.features);
  }, [data]);

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

  const connect = function () {
    const wsURL = `${window.location.protocol === "https:" ? "wss:" : "ws:"}//${
      window.location.host
    }/api/v1/ws/${user.currentOrganization.id}/${uuidv4()}`;

    const newWS = new WebSocket(wsURL);
    newWS.addEventListener("message", onWSMessage);
    newWS.addEventListener("close", function () {
      setTimeout(connect, 1000);
    });
    newWS.addEventListener("error", function () {
      newWS.close();
    });
  };

  useEffect(() => {
    if (router.query.tree) {
      apiRest.trees
        .get(user.currentOrganization.id, router.query.tree)
        .then((tree) => {
          if (mapRef.current) {
            mapRef.current.getMap().flyTo({
              zoom: 20,
              center: [tree.x, tree.y],
            });
          }
        });
    }

    connect();
  }, []);

  const switchPanel = (panel) => {
    switch (panel) {
      case "start":
        setDrawerLeftComponent(<PanelStartGeneralInfo />);
        break;
      case "info":
        setDrawerLeftComponent(
          <TreeSummary treeId={Number(router.query.tree)} />
        );
        break;
      case "tree":
        if (boxSelect) {
          const Tree = dynamic(() => import("@/components/Tree/Form"));
          setBoxSelect(true);
          setDrawerLeftComponent(
            <Tree selection={selection} onSave={handleOnTreeSave} />
          );
        }
        break;
      case "import":
        const Import = dynamic(() => import("@/components/Import/Panel/Index"));
        setDrawerLeftComponent(
          <Import
            onFileImported={async () => {
              getData(user.currentOrganization.id, true);
            }}
          />
        );
        break;
      case "intervention":
        const Intervention = dynamic(
          () => import("@/components/Interventions/Form")
        );
        setDrawerLeftComponent(<Intervention map={mapRef.current.getMap()} />);
        break;
      default:
        setDrawerLeftComponent(<PanelStartGeneralInfo />);
        break;
    }
  };

  useEffect(() => {
    if (!router.query.panel) return;

    switchPanel(router.query.panel);
  }, [router.query]);

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
    if (event.features.length > 0 && !boxSelect) {
      router.push(
        `/edition/?panel=info&tree=${event.features[0].properties.id}`
      );
    }
  };

  const handleFilter = (query: string) => {
    setFilterQuery(query);
  };

  const handleOnMapToolbarChange = (action: TMapToolbarAction) => {
    const map = mapRef.current.getMap();

    switch (action) {
      case "zoom_in":
        return map.setZoom(map.getZoom() + 1);
      case "zoom_out":
        return map.setZoom(map.getZoom() - 1);
      case "toggle_layers":
        setDrawerRightComponent(
          drawerRightComponent === null ? <MapLayers map={map} /> : null
        );
        break;
      case "filter":
        setDrawerRightComponent(
          drawerRightComponent === null ? (
            <MapFilter
              map={map}
              handleFilter={handleFilter}
              filterQuery={filterQuery}
            />
          ) : null
        );
        break;
      case "geolocate":
        return geolocateControlRef.current.getControl().trigger();
      case "fit_to_bounds":
        if (data) {
          return map.fitBounds(bbox(data));
        }
        break;
      case "import":
        return router.push("/edition/?panel=import");
    }
  };

  const handleOnDrawerLeftClose = () => {
    setDrawerLeftComponent(null);
    setTimeout(() => {
      window.dispatchEvent(new Event("resize"));
    }, 50);
  };

  return (
    <AppLayoutCarto
      drawerRightComponent={drawerRightComponent}
      drawerLeftComponent={drawerLeftComponent}
      onDrawerLeftClose={handleOnDrawerLeftClose}
      onMapToolbarChange={handleOnMapToolbarChange}
    >
      <Grid className={classes.root} id="map-edition">
        {viewport && (
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
              data={filteredData ? filteredData : null}
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

                    await apiRest.trees.post(
                      user.currentOrganization.id,
                      newTree
                    );
                  }
                }}
                onDrawDelete={async (selection) => {
                  const ids = selection.features
                    .map((feature) => feature.properties.id)
                    .filter((id) => id);

                  await apiRest.trees.bulkDelete(
                    user.currentOrganization.id,
                    JSON.stringify(ids)
                  );
                  await getData(user.currentOrganization.id);
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
                onDrawSelectionChange={(selection) => {
                  setSelection(selection.features);
                  router.push("/edition/?panel=tree");
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
        )}
        <Box className={classes.toolbar} p={1}>
          <Grid container spacing={2} justify="center" alignItems="center">
            <Grid item>
              <MapModeSwitch
                initValue={boxSelect ? "edition" : "analysis"}
                onChange={(value) => {
                  switch (value) {
                    case "analysis":
                      setBoxSelect(false);
                      router.push("/edition/?panel=start");
                      break;
                    case "edition":
                      setBoxSelect(true);
                      break;
                  }
                }}
              />
            </Grid>
            <Grid item xs></Grid>
            <Grid item>
              {boxSelect && (
                <MapDrawToolbar
                  onChange={(value) => {
                    switch (value) {
                      case "simple_select":
                        setMode("simple_select");
                        setCurrentMode("simple_select");
                        break;
                      case "draw_point":
                        setMode("draw_point");
                        setCurrentMode("draw_point");
                        break;
                      case "draw_polygon":
                        setMode("draw_polygon");
                        setCurrentMode("draw_polygon");
                        break;
                    }
                  }}
                />
              )}
            </Grid>
            <Grid item xs></Grid>
            <Grid item>
              <MapSearchCity map={mapRef} />
            </Grid>
          </Grid>
        </Box>
      </Grid>
    </AppLayoutCarto>
  );
};

export default EditionPage;
