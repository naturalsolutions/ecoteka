import { useEffect, useState } from "react";
import { Grid, makeStyles, Box, Button, IconButton } from "@material-ui/core";
import LayersIcon from "@material-ui/icons/Layers";
import CloseIcon from "@material-ui/icons/Close";
import CenterFocusStrongIcon from "@material-ui/icons/CenterFocusStrong";
import MenuOpenIcon from "@material-ui/icons/MenuOpen";
import SearchIcon from "@material-ui/icons/Search";
import PlaylistAddCheckIcon from "@material-ui/icons/PlaylistAddCheck";
import useApi from "@/lib/useApi";
import { useAppContext } from "@/providers/AppContext";
import { useRouter } from "next/router";
import TreeSummary from "@/components/Tree/Infos/Summary";
import TreeForm from "@/components/Tree/Form";
import { TMapToolbarAction } from "@/components/Map/Toolbar";
import MapGeolocateFab from "@/components/Map/GeolocateFab";
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
import { FlyToInterpolator } from "@deck.gl/core";
import DeckGL from "@deck.gl/react";
import { MVTLayer } from "@deck.gl/geo-layers";
import { SelectionLayer } from "nebula.gl";
import { StaticMap } from "react-map-gl";

const useStyles = makeStyles({
  toolbar: {
    position: "absolute",
    top: 10,
    left: 0,
    width: "calc(100% - 8px)",
    pointerEvents: "none",
  },
  actionsBar: {
    pointerEvents: "fill",
  },
});

const defaultViewState = {
  longitude: 2.54,
  latitude: 46.7,
  zoom: 5,
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
  const [drawerLeftWidth, setDrawerLeftWidth] = useState(400);
  const [token] = useLocalStorage("ecoteka_access_token");
  const [initialViewState, setInitialViewState] = useLocalStorage(
    "etk:map:viewstate",
    defaultViewState
  );
  const [viewState, setViewState] = useState();
  const [mode, setMode] = useState("selection");
  const [filter, setFilter] = useState({
    canonicalName: [],
    vernacularName: [],
  });
  const [filterOpts, setFilterOpts] = useState({
    canonicalName: [],
    vernacularName: [],
  });
  const [selection, setSelection] = useState([]);
  const [editionMode, setEditionMode] = useState<boolean>(false);
  const [layers, setLayers] = useState([]);
  const [activeTree, setActiveTree] = useState<number | undefined>(
    router.query?.tree ? Number(router.query.tree) : undefined
  );

  const getFilters = async (organizationId) => {
    try {
      const { status, data } = await apiETK.get("/maps/filter", {
        params: {
          organization_id: organizationId,
        },
      });

      if (status === 200) {
        setFilterOpts(data);
      }
    } catch (error) {}
  };

  const createTree = async (x, y) => {
    try {
      const organizationId = user.currentOrganization.id;
      const payload = { x, y };
      const url = `/organization/${organizationId}/trees`;

      setTime(Date.now());
      const { status, data: tree } = await apiETK.post(url, payload);

      if (status === 200) {
        router.push(`/map/?panel=edit&tree=${tree.id}`);
        setActiveTree(tree.id);
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
    pointRadiusMinPixels: 1,
    pointRadiusMaxPixels: 10,
    pointRadiusScale: 2,
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
    uniqueIdProperty: "id",
    getLineColor: (d) => {
      if (selection.includes(d.properties.id)) {
        return [255, 0, 0, 100];
      }

      if (activeTree === d.properties.id) {
        return [255, 100, 0];
      }

      if (
        filter.canonicalName?.includes(d.properties.properties_canonicalName)
      ) {
        const index = filterOpts.canonicalName.findIndex(
          (f) => f.value === d.properties.properties_canonicalName
        );
        const color = filterOpts.canonicalName[index].color;

        return color;
      }

      if (
        filter.vernacularName?.includes(d.properties.properties_vernacularName)
      ) {
        return filterOpts.vernacularName[
          filterOpts.vernacularName.findIndex(
            (f) => f.value === d.properties.properties_vernacularName
          )
        ].color;
      }

      for (let key in filter) {
        if (filter[key].length > 0) {
          return [120, 120, 120, 128];
        }
      }

      return [34, 169, 54, 100];
    },
    getFillColor: (d) => {
      if (selection.includes(d.properties.id)) {
        return [255, 0, 0, 100];
      }

      if (activeTree === d.properties.id) {
        return [255, 100, 0];
      }

      if (
        filter.canonicalName?.includes(d.properties.properties_canonicalName)
      ) {
        const index = filterOpts.canonicalName.findIndex(
          (f) => f.value === d.properties.properties_canonicalName
        );
        const color = filterOpts.canonicalName[index].color;

        return color;
      }

      if (
        filter.vernacularName?.includes(d.properties.properties_vernacularName)
      ) {
        const index = filterOpts.vernacularName.findIndex(
          (f) => f.value === d.properties.properties_vernacularName
        );
        const color = filterOpts.vernacularName[index].color;

        return color;
      }

      for (let key in filter) {
        if (filter[key].length > 0) {
          return [120, 120, 120, 128];
        }
      }

      return [34, 139, 34, 100];
    },
    updateTriggers: {
      getFillColor: [activeTree, selection, editionMode, filter],
      getLineColor: [activeTree, selection, editionMode, filter],
    },
    pickable: true,
    autoHighlight: true,
    getRadius: (d) => (activeTree === d.properties.id ? 15 : 3),
    pointRadiusMinPixels: 2,
    pointRadiusMaxPixels: 15,
    pointRadiusScale: 2,
    minRadius: 10,
    radiusMinPixels: 0.5,
    lineWidthMinPixels: 1,
  });

  const selectionLayer = new SelectionLayer({
    selectionType: "rectangle",
    onSelect: ({ pickingInfos }) => {
      const ids = pickingInfos.map((o) => o.object.properties.id);
      setSelection(ids);
    },
    layerIds: ["trees"],
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

        setViewState({
          ...newViewState,
          transitionDuration: 1000,
          transitionInterpolator: new FlyToInterpolator(),
        });
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
    setTime(Date.now());
  };

  useEffect(() => {
    setViewState({ ...initialViewState });
    renderLayers();
    getFilters(user.currentOrganization.id);
  }, []);

  const switchPanel = (panel) => {
    if (panel !== "edit") {
      setDrawerLeftWidth(400);
    }

    switch (panel) {
      case "start":
        return setDrawerLeftComponent(<PanelStartGeneralInfo />);
      case "info":
        return setDrawerLeftComponent(<TreeSummary treeId={activeTree} />);
      case "edit":
        setDrawerLeftWidth(500);
        return setDrawerLeftComponent(
          <TreeForm treeId={activeTree} onSave={() => {}} />
        );
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
            options={filterOpts}
            onChange={handleOnFilter}
          />
        );
      default:
        return setDrawerLeftComponent(<PanelStartGeneralInfo />);
    }
  };

  useEffect(() => {
    if (router.query?.tree) {
      setActiveTree(Number(router.query.tree));
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

  const handleOnMapModeSwitch = (newMode) => {
    if (newMode) {
      if (newMode === "edtion") {
        setMode("selection");
      } else {
        setMode("");
      }

      setEditionMode(newMode === "edition");
    }
  };

  const handleOnDeleteTrees = async () => {
    if (!selection.length) {
      return;
    }

    try {
      const url = `/organization/${user.currentOrganization.id}/trees/bulk_delete`;
      const { status, data } = await apiETK.delete(url, {
        data: {
          trees: selection,
        },
      });

      if (status === 200) {
        setTime(Date.now());

        if (selection.includes(activeTree)) {
          setActiveTree();
          setDrawerLeftComponent();
          router.push("/map");
        }

        setSelection([]);
      }
    } catch (e) {}
  };

  const renderLayers = () => {
    setTime(Date.now());

    if (editionMode && mode === "selection") {
      return setLayers([treesLayer, selectionLayer]);
    }

    if (editionMode) {
      return setLayers([treesLayer]);
    }

    return setLayers([osmLayer, treesLayer]);
  };

  useEffect(() => {
    if (mode !== "selection") {
      setSelection([]);
    }
  }, [mode]);

  useEffect(() => {
    renderLayers();
  }, [activeTree, editionMode, selection, filter, mode]);

  return (
    <AppLayoutCarto
      drawerLeftComponent={drawerLeftComponent}
      drawerLeftWidth={drawerLeftWidth}
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
          if (editionMode && mode === "drawPoint") {
            const [x, y] = info.coordinate;

            return createTree(x, y);
          }

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
        ></StaticMap>
        {navigator?.geolocation && (
          <MapGeolocateFab
            onGeolocate={() => {
              navigator.geolocation.getCurrentPosition((position) => {
                setViewState({
                  ...viewState,
                  longitude: position.coords.longitude,
                  latitude: position.coords.latitude,
                  zoom: 18,
                  transitionDuration: 1500,
                  transitionInterpolator: new FlyToInterpolator(),
                });
              });
            }}
          />
        )}
      </DeckGL>
      <Box className={classes.toolbar} mt={1}>
        <Grid container justify="center">
          <Grid item>
            <Grid container direction="column" className={classes.actionsBar}>
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
                <SearchIcon />
              </IconButton>
              <IconButton onClick={() => router.push("/map?panel=layers")}>
                <LayersIcon />
              </IconButton>
              <IconButton
                onClick={() => router.push("/map?panel=interventions")}
              >
                <PlaylistAddCheckIcon />
              </IconButton>
              <IconButton onClick={() => switchPanel("import")}>
                <BackupIcon />
              </IconButton>
            </Grid>
          </Grid>
          <Grid item>
            <Box ml={2} className={classes.actionsBar}>
              <MapModeSwitch
                initValue={editionMode ? "edition" : "analysis"}
                onChange={handleOnMapModeSwitch}
              />
            </Box>
          </Grid>

          <Grid item xs></Grid>
          {editionMode && (
            <Grid item className={classes.actionsBar}>
              <MapDrawToolbar
                activeDelete={Boolean(selection.length)}
                onDelete={handleOnDeleteTrees}
                onChange={(newMode) => {
                  if (newMode) {
                    setMode(newMode);
                  }
                }}
              />
            </Grid>
          )}
          <Grid item xs></Grid>
          <Grid item className={classes.actionsBar}>
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
          </Grid>
          <Grid item className={classes.actionsBar}>
            <Box mt={1} ml={1}>
              <IconButton
                size="small"
                onClick={() => fitToBounds(user.currentOrganization.id)}
              >
                <CenterFocusStrongIcon />
              </IconButton>
            </Box>
          </Grid>
        </Grid>
      </Box>
    </AppLayoutCarto>
  );
};

export default EditionPage;
