import { useEffect, useState } from "react";
import { Grid, makeStyles, Box, Button, IconButton } from "@material-ui/core";
import CloseIcon from "@material-ui/icons/Close";
import MenuOpenIcon from "@material-ui/icons/MenuOpen";
import KeyboardArrowLeftIcon from "@material-ui/icons/KeyboardArrowLeft";
import KeyboardArrowRightIcon from "@material-ui/icons/KeyboardArrowRight";
import FilterListIcon from "@material-ui/icons/FilterList";
import useApi from "@/lib/useApi";
import { useAppContext } from "@/providers/AppContext";
import { useRouter } from "next/router";
import TreeSummary from "@/components/Tree/Infos/Summary";
import TreeForm from "@/components/Tree/Form";
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
import BackupIcon from "@material-ui/icons/Backup";
import getConfig from "next/config";

import { FlyToInterpolator, WebMercatorViewport } from "@deck.gl/core";
import DeckGL from "@deck.gl/react";
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
  const classes = useStyles();
  const router = useRouter();
  const { user } = useAppContext();
  const { dark } = useThemeContext();
  const { apiETK } = useApi().api;
  const [drawerLeftComponent, setDrawerLeftComponent] = useState(
    <PanelStartGeneralInfo />
  );
  const [token] = useLocalStorage("ecoteka_access_token");
  const [initialViewState, setInitialViewState] = useLocalStorage(
    "etk:map:viewstate",
    defaultViewState
  );
  const [viewState, setViewState] = useState();
  const [mode, setMode] = useState("selection");
  const [filter, setFilter] = useState({});
  const [selection, setSelection] = useState([]);
  const [editionMode, setEditionMode] = useState<boolean>(false);
  const [layers, setLayers] = useState([]);
  const [activeTree, setActiveTree] = useState(Number(router.query?.tree));

  const createTree = async (x, y) => {
    try {
      const organizationId = user.currentOrganization.id;
      const payload = { x, y };
      const url = `/organization/${organizationId}/trees`;

      const { status, data: tree } = await apiETK.post(url, payload);

      if (status === 200) {
        setTime(Date.now());
        setDrawerLeftComponent(
          <TreeForm
            tree={tree}
            onSave={(newTree) => {
              console.log(newTree);
            }}
          />
        );
        setActiveTree(tree.id);
        renderLayers();
      }
    } catch (error) {
      console.log(error);
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
        return [255, 255, 0, 100];
      }

      if (selection.includes(d.properties.id)) {
        return [255, 0, 0, 100];
      }

      return [34, 169, 54, 100];
    },
    getFillColor: (d) => {
      if (activeTree === d.properties.id) {
        return [255, 255, 0, 100];
      }

      if (router.query?.tree === d.properties.id) {
        return [255, 255, 0, 100];
      }

      if (selection.includes(d.properties.id)) {
        return [255, 0, 0, 100];
      }

      return [34, 139, 34, 100];
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

  const fitToBounds = async (organizationId: number) => {
    try {
      const { status, data: bbox } = await apiETK.get(`/maps/bbox`, {
        params: {
          organization_id: organizationId,
        },
      });

      if (status === 200) {
        const newViewState = layers[0].context.viewport.fitBounds([
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
    setViewState({ ...initialViewState });
    renderLayers();
  }, []);

  const switchPanel = (panel) => {
    switch (panel) {
      case "start":
        return setDrawerLeftComponent(<PanelStartGeneralInfo />);
      case "info":
        return setDrawerLeftComponent(<TreeSummary treeId={activeTree} />);
      case "import":
        return setDrawerLeftComponent(
          <ImportPanel onFileImported={handleOnFileImported} />
        );
      case "intervention":
        return setDrawerLeftComponent(<InterventionForm />);
      case "filter":
        const initialValue = Object.keys(filter).reduce((a, v) => {
          a[v] = filter[v].map((f) => {
            return { value: f };
          });

          return a;
        }, {});

        return setDrawerLeftComponent(
          <MapFilter
            initialValue={initialValue}
            organizationId={user?.currentOrganization?.id}
            onChange={handleOnFilter}
          />
        );
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
      case "geolocate":
        break;
      case "fit_to_bounds":
        fitToBounds(user.currentOrganization.id);
        break;
    }
  };

  const handleOnDrawerLeftClose = () => {
    setDrawerLeftComponent(null);
    router.push("/map");
  };

  const handleOnMapModeSwitch = (newMode) => {
    if (newMode === "analysis") {
      setSelection([]);
    }

    if (newMode) {
      setEditionMode(newMode === "edition");
    }
  };

  const renderLayers = () => {
    setLayers(editionMode ? [treesLayer, selectionLayer] : [treesLayer]);
  };

  useEffect(() => {
    renderLayers();
  }, [activeTree, editionMode, selection]);

  return (
    <AppLayoutCarto
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
          if (mode === "drawPoint") {
            const [x, y] = info.coordinate;

            return createTree(x, y);
          }
          if (editionMode) return;
          if (
            info.object?.properties?.id === activeTree ||
            !info.object?.properties?.id
          ) {
            setActiveTree();
            router.push("/map");
            setDrawerLeftComponent();
          } else {
            setActiveTree(info.object?.properties?.id);
            router.push(`/map/?panel=info&tree=${info.object?.properties.id}`);
          }
        }}
      >
        <StaticMap
          mapStyle={`/api/v1/maps/style/?theme=${dark ? "dark" : "light"}`}
        />
      </DeckGL>
      <Box className={classes.toolbar} p={1}>
        <Grid container spacing={2} justify="center">
          <Grid item>
            <Grid container direction="column">
              <IconButton
                onClick={() => {
                  !drawerLeftComponent
                    ? switchPanel(router.query.panel)
                    : setDrawerLeftComponent();
                }}
              >
                {drawerLeftComponent ? <CloseIcon /> : <MenuOpenIcon />}
              </IconButton>
              <IconButton onClick={() => router.push("/map?panel=filter")}>
                <FilterListIcon />
              </IconButton>
              <IconButton onClick={() => switchPanel("import")}>
                <BackupIcon />
              </IconButton>
            </Grid>
          </Grid>
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
                    setMode(newMode);
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
