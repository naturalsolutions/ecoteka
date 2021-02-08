import { useEffect, useState } from "react";
import { Grid, makeStyles, Box } from "@material-ui/core";
import useApi from "@/lib/useApi";
import { useAppContext } from "@/providers/AppContext";
import { useRouter } from "next/router";
import TreeSummary from "@/components/Tree/Infos/Summary";
import TreeForm from "@/components/Tree/Form";
import dynamic from "next/dynamic";
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
import ImportPanel from "@/components/Import/Panel/Index";
import InterventionForm from "@/components/Interventions/Form";
import getConfig from "next/config";
import qs from "qs";

import { FlyToInterpolator, WebMercatorViewport } from "@deck.gl/core";
import DeckGL from "@deck.gl/react";
import { GeoJsonLayer } from "@deck.gl/layers";
import { MVTLayer } from "@deck.gl/geo-layers";
import {
  SelectionLayer,
  EditableGeoJsonLayer,
  DrawPointMode,
  ViewMode,
  DrawPolygonMode,
} from "nebula.gl";
import { StaticMap } from "react-map-gl";
import Organization from "./organization/[id]";

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

const defaultViewState = {
  longitude: 2.54,
  latitude: 46.7,
  zoom: 5,
};

const initialData = {
  type: "FeatureCollection",
  features: [],
};

const EditionPage = ({}) => {
  const { publicRuntimeConfig } = getConfig();
  const { apiUrl } = publicRuntimeConfig;
  const [time, setTime] = useState(Date.now());

  const modes = {
    selection: ViewMode,
    drawPoint: DrawPointMode,
    drawPolygon: DrawPolygonMode,
  };
  const classes = useStyles();
  const router = useRouter();
  const { user } = useAppContext();
  const { dark } = useThemeContext();
  const { apiETK } = useApi().api;
  const [drawerLeftComponent, setDrawerLeftComponent] = useState(
    <PanelStartGeneralInfo />
  );
  const [drawerRightComponent, setDrawerRightComponent] = useState(null);
  const [token] = useLocalStorage("ecoteka_access_token");
  const [initialViewState, setInitialViewState] = useLocalStorage(
    "etk:map:viewstate",
    defaultViewState
  );
  const [viewState, setViewState] = useState();
  const [mode, setMode] = useState(new ViewMode());
  const [data, setData] = useState<any>(initialData);
  const [currentData, setCurrentData] = useState([]);
  const [filter, setFilter] = useState({});
  const [selection, setSelection] = useState([]);
  const [editionMode, setEditionMode] = useState<boolean>(false);
  const [layers, setLayers] = useState([]);
  const [activeTree, setActiveTree] = useState(Number(router.query?.tree));

  const handleOnEditLayer = async ({ updatedData, editType, editContext }) => {
    if (editType === "addFeature") {
      try {
        const organizationId = user.currentOrganization.id;
        const feature = updatedData.features[editContext.featureIndexes[0]];
        const [x, y] = feature.geometry.coordinates;
        const payload = { x, y };
        const url = `/organization/${organizationId}/trees`;

        const { status, data: tree } = await apiETK.post(url, payload);

        if (status === 200) {
          feature.properties = tree;
          updatedData.features[editContext.featureIndexes[0]] = feature;
          setData(updatedData);
          setDrawerLeftComponent(
            <TreeForm
              selection={[feature]}
              onSave={(newTree) => {
                console.log(newTree);
              }}
            />
          );
        }
      } catch (error) {
        console.log(error);
      }
    }
  };

  const osmLayer = new MVTLayer({
    id: "osm",
    data: `${apiUrl.replace(
      "/api/v1",
      ""
    )}/tiles/osm/{z}/{x}/{y}.pbf?scope=public`,
    minZoom: 0,
    maxZoom: 13,
    getRadius: 1,
    radiusScale: 10,
    radiusMinPixels: 0.25,
    lineWidthMinPixels: 1,
    getLineColor: [192, 192, 192],
    getFillColor: [140, 170, 180],
    pickable: true,
  });

  const treesLayer = new MVTLayer({
    id: "trees",
    data: `${apiUrl.replace("/api/v1", "")}/tiles/${
      user?.currentOrganization.slug
    }/{z}/{x}/{y}.pbf?scope=private&token=${token}&dt=${time}`,
    minZoom: 0,
    maxZoom: 12,
    getLineColor: (d) => {
      if (activeTree === d.properties.id) {
        return [255, 255, 0];
      }

      if (selection.includes(d.properties.id)) {
        return [255, 0, 0];
      }

      return [34, 169, 54];
    },
    getFillColor: (d) => {
      if (activeTree === d.properties.id) {
        return [255, 255, 0];
      }

      if (router.query?.tree === d.properties.id) {
        return [255, 255, 0];
      }

      if (selection.includes(d.properties.id)) {
        return [255, 0, 0];
      }

      return [34, 139, 34];
    },
    updateTriggers: {
      getFillColor: [activeTree],
      getLineColor: [activeTree],
    },
    pickable: true,
    autoHighlight: true,
    pointRadiusMinPixels: 3,
    pointRadiusMaxPixels: 10,
    pointRadiusScale: 2,
    minRadius: 10,
    radiusMinPixels: 0.5,
    lineWidthMinPixels: 1,
    getPosition: (d) => d.coordinates,
  });

  const editLayer = new EditableGeoJsonLayer({
    id: "edit",
    data: data,
    pickable: true,
    autoHighlight: true,
    getRadius: 1,
    radiusScale: 10,
    radiusMinPixels: 0.25,
    lineWidthMinPixels: 1,
    mode,
    getLineColor: [34, 139, 34],
    getFillColor: [34, 139, 34],
    onEdit: handleOnEditLayer,
  });

  const selectionLayer = new SelectionLayer({
    selectionType: "rectangle",
    onSelect: ({ pickingInfos }) => {
      const ids = pickingInfos.map((o) => o.object.properties.id);
      setSelection(ids);
    },
    layerIds: ["edit", "trees"],
    getTentativeFillColor: () => [255, 0, 255, 100],
    getTentativeLineColor: () => [0, 0, 255, 255],
    getTentativeLineDashArray: () => [0, 0],
    lineWidthMinPixels: 1,
  });

  const fitToBounds = async (organizationId: number, viewport) => {
    try {
      const { status, data: bbox } = await apiETK.get(`/maps/bbox`, {
        params: {
          organization_id: organizationId,
        },
      });

      if (status === 200) {
        const newViewState = viewport.fitBounds([
          [bbox.xmin, bbox.ymin],
          [bbox.xmax, bbox.ymax],
        ]);

        setInitialViewState({
          longitude: newViewState.longitude,
          latitude: newViewState.latitude,
          zoom: newViewState.zoom,
        });

        setViewState(newViewState);
      }
    } catch (e) {}
  };

  const getData = async (organizationId: number) => {
    try {
      const url = `/organization/${organizationId}/geojson`;
      const { data: geoData, status } = await apiETK.get(url);

      if (status === 200) {
        setCurrentData(geoData.features.map((f) => f.properties.id));

        geoData.features = geoData.features.filter(
          (f) => f.properties.status !== "delete"
        );

        setData(geoData);
      }
    } catch (e) {}
  };

  const handleOnFileImported = (coordinates) => {
    setViewState({
      longitude: coordinates[0],
      latitude: coordinates[1],
      zoom: 15,
      transitionDuration: 1200,
      transitionInterpolator: new FlyToInterpolator(),
    });
  };

  useEffect(() => {
    getData(user.currentOrganization?.id);
    setViewState({ ...initialViewState });
    renderLayers();
  }, []);

  const switchPanel = (panel) => {
    switch (panel) {
      case "start":
        return setDrawerLeftComponent(<PanelStartGeneralInfo />);
      case "info":
        return setDrawerLeftComponent(
          <TreeSummary treeId={Number(router.query.tree)} />
        );
      case "import":
        return setDrawerLeftComponent(
          <ImportPanel onFileImported={handleOnFileImported} />
        );
      case "intervention":
        return setDrawerLeftComponent(<InterventionForm />);
      default:
        return setDrawerLeftComponent(<PanelStartGeneralInfo />);
    }
  };

  useEffect(() => {
    if (!router.query.panel && router.query.tree) {
      router.query.panel = "info";
    }

    if (!router.query.panel) return;

    switchPanel(router.query.panel);
  }, [router.query]);

  const handleOnFilter = (newFilter) => {
    setFilter(newFilter);
  };

  const handleOnMapToolbarChange = (action: TMapToolbarAction) => {
    switch (action) {
      case "zoom_in":
        return setViewState({ ...viewState, zoom: viewState.zoom + 1 });
      case "zoom_out":
        return setViewState({ ...viewState, zoom: viewState.zoom - 1 });
      case "toggle_layers":
        break;
      case "filter":
        const initialValue = Object.keys(filter).reduce((a, v) => {
          a[v] = filter[v].map((f) => {
            return { value: f };
          });

          return a;
        }, {});

        return setDrawerRightComponent(
          drawerRightComponent ? null : (
            <MapFilter
              initialValue={initialValue}
              organizationId={user?.currentOrganization?.id}
              onChange={handleOnFilter}
            />
          )
        );
      case "geolocate":
        break;
      case "fit_to_bounds":
        fitToBounds(user.currentOrganization.id, treesLayer.context.viewport);
        break;
      case "import":
        return router.push("/map/?panel=import");
    }
  };

  const handleOnDrawerLeftClose = () => {
    setDrawerLeftComponent(null);
    router.push("/map");
  };

  const handleOnMapModeSwitch = () => {
    if (editionMode) {
      setMode(new modes.selection());
    }

    setEditionMode(!editionMode);
    renderLayers();
  };

  const renderLayers = () => {
    setLayers(
      !editionMode
        ? [treesLayer, editLayer, selectionLayer]
        : [osmLayer, treesLayer, editLayer]
    );
  };

  useEffect(() => {
    renderLayers();
  }, [activeTree]);

  return (
    <AppLayoutCarto
      drawerRightComponent={drawerRightComponent}
      drawerLeftComponent={drawerLeftComponent}
      onDrawerLeftClose={handleOnDrawerLeftClose}
      onMapToolbarChange={handleOnMapToolbarChange}
    >
      <DeckGL
        viewState={viewState}
        controller={true}
        layers={layers}
        onViewStateChange={(e) => {
          setInitialViewState({
            longitude: e.viewState.longitude,
            latitude: e.viewState.latitude,
            zoom: e.viewState.zoom,
          });
          setViewState(e.viewState);
        }}
        onClick={(info) => {
          setActiveTree(info.object?.properties?.id);

          if (["trees", "edit"].includes(info.layer?.id)) {
            router.push(`/map/?panel=info&tree=${info.object?.properties.id}`);
          }
        }}
      >
        <StaticMap
          mapStyle={`/api/v1/maps/style/?theme=${dark ? "dark" : "light"}`}
        />
      </DeckGL>
      <Box className={classes.toolbar} p={1}>
        <Grid container spacing={2} justify="center" alignItems="center">
          <Grid item>
            <MapModeSwitch
              initValue={editionMode ? "edition" : "analysis"}
              onChange={handleOnMapModeSwitch}
            />
          </Grid>
          <Grid item xs></Grid>
          {editionMode && (
            <Grid item>
              <MapDrawToolbar
                onChange={(newMode) => {
                  if (newMode) {
                    setMode(new modes[newMode]());
                  }
                }}
              />
            </Grid>
          )}
          <Grid item xs></Grid>
          <Grid item>
            <Box mr={1}>
              <MapSearchCity
                onChange={(coordinates) => {
                  setViewState({
                    ...viewState,
                    longitude: coordinates[0],
                    latitude: coordinates[1],
                    zoom: 15,
                    transitionDuration: 1500,
                    transitionInterpolator: new FlyToInterpolator(),
                  });
                }}
              />
            </Box>
          </Grid>
        </Grid>
      </Box>
    </AppLayoutCarto>
  );
};

export default EditionPage;
