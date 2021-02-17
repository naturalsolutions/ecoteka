// @ts-nocheck
import { useEffect, useState } from "react";
import { Grid, makeStyles, Box, IconButton, Hidden } from "@material-ui/core";
import LayersIcon from "@material-ui/icons/Layers";
import CloseIcon from "@material-ui/icons/Close";
import CenterFocusStrongIcon from "@material-ui/icons/CenterFocusStrong";
import MenuOpenIcon from "@material-ui/icons/MenuOpen";
import SearchIcon from "@material-ui/icons/Search";
import InfoIcon from "@material-ui/icons/Info";
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
import { GeoJsonLayer } from "@deck.gl/layers";
import { MVTLayer } from "@deck.gl/geo-layers";
import { SelectionLayer } from "nebula.gl";
import { StaticMap } from "react-map-gl";
import Head from "next/head";
import { ITree } from "@/components";
import InterventionsEdit from "@/components/Interventions/Panel";
import Can from "@/components/Can";
import geobuf from "geobuf";
import Pbf from "pbf";

const useStyles = makeStyles({
  toolbar: {
    position: "absolute",
    top: 16,
    left: 60,
    width: "calc(100% - 68px)",
    pointerEvents: "none",
  },
  toolbarAction: {
    pointerEvents: "fill",
  },
  actionsBar: {
    position: "absolute",
    top: 8,
    left: 8,
    display: "flex",
    flexDirection: "column",
  },
});

const defaultViewState = {
  longitude: 2.54,
  latitude: 46.7,
  zoom: 5,
};

const defaultFilter = {
  canonicalName: [],
  vernacularName: [],
};

const defaultFilters = {
  filters: defaultFilter,
  options: defaultFilter,
  values: defaultFilter,
};

const defaultData = {
  type: "FeatureCollection",
  features: [],
};

const EditionPage = ({}) => {
  const { publicRuntimeConfig } = getConfig();
  const { apiUrl } = publicRuntimeConfig;
  const classes = useStyles();
  const router = useRouter();
  const { user } = useAppContext();
  const { dark } = useThemeContext();
  const { apiETK } = useApi().api;
  const [numberOfTrees, setNumberOfTrees] = useState(0);
  const [drawerLeftComponent, setDrawerLeftComponent] = useState(
    <PanelStartGeneralInfo />
  );
  const [drawerLeftWidth, setDrawerLeftWidth] = useState(400);
  const [initialViewState, setInitialViewState] = useLocalStorage(
    "etk:map:viewstate",
    defaultViewState
  );
  const [viewState, setViewState] = useState();
  const [mode, setMode] = useState("selection");
  const [filters, setFilters] = useState(defaultFilters);
  const [selection, setSelection] = useState([]);
  const [editionMode, setEditionMode] = useState<boolean>(false);
  const [mapBackground, setMapbackground] = useLocalStorage(
    "etk:map:mapBackground",
    "map"
  );
  const [layers, setLayers] = useState([]);
  const [activeTree, setActiveTree] = useState<number | undefined>(
    router.query?.tree ? Number(router.query.tree) : undefined
  );
  const [loading, setLoading] = useState(false);
  const [data, setData] = useLocalStorage("etk:map:data", defaultData);
  const [dataOrganizationId, setDataOrganizationId] = useLocalStorage(
    "etk:map:dataOrganizationId",
    user?.currentOrganization.id
  );

  const createTree = async (x, y) => {
    try {
      const organizationId = user.currentOrganization.id;
      const payload = { x, y };
      const url = `/organization/${organizationId}/trees`;

      const { status, data: tree } = await apiETK.post(url, payload);

      if (status === 200) {
        const newData = { ...data };
        const feature = {
          id: String(newData.features.length),
          type: "Feature",
          geometry: {
            type: "Point",
            coordinates: [x, y],
          },
          properties: tree,
        };

        newData.features.push(feature);

        setData(newData);

        router.push(`/map/?panel=edit&tree=${tree.id}`);
        setActiveTree(tree.id);
      }
    } catch (error) {}
  };

  const Base64Binary = {
    _keyStr:
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",

    /* will return a  Uint8Array type */
    decodeArrayBuffer: function (input) {
      var bytes = (input.length / 4) * 3;
      var ab = new ArrayBuffer(bytes);
      this.decode(input, ab);

      return ab;
    },

    removePaddingChars: function (input) {
      var lkey = this._keyStr.indexOf(input.charAt(input.length - 1));
      if (lkey == 64) {
        return input.substring(0, input.length - 1);
      }
      return input;
    },

    decode: function (input, arrayBuffer) {
      //get last chars to see if are valid
      input = this.removePaddingChars(input);
      input = this.removePaddingChars(input);

      var bytes = parseInt((input.length / 4) * 3, 10);

      var uarray;
      var chr1, chr2, chr3;
      var enc1, enc2, enc3, enc4;
      var i = 0;
      var j = 0;

      if (arrayBuffer) uarray = new Uint8Array(arrayBuffer);
      else uarray = new Uint8Array(bytes);

      input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");

      for (i = 0; i < bytes; i += 3) {
        //get the 3 octects in 4 ascii chars
        enc1 = this._keyStr.indexOf(input.charAt(j++));
        enc2 = this._keyStr.indexOf(input.charAt(j++));
        enc3 = this._keyStr.indexOf(input.charAt(j++));
        enc4 = this._keyStr.indexOf(input.charAt(j++));

        chr1 = (enc1 << 2) | (enc2 >> 4);
        chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
        chr3 = ((enc3 & 3) << 6) | enc4;

        uarray[i] = chr1;
        if (enc3 != 64) uarray[i + 1] = chr2;
        if (enc4 != 64) uarray[i + 2] = chr3;
      }

      return uarray;
    },
  };

  const getData = async (id: number) => {
    try {
      setLoading(true);
      const { status, data: newData } = await apiETK.get(
        `/maps/geobuf?organization_id=${id}`
      );

      if (status === 200 && newData.pbf) {
        const arrayBuffer = Base64Binary.decodeArrayBuffer(newData.pbf);
        const pbf = new Pbf(arrayBuffer);
        const geojson = geobuf.decode(pbf);
        geojson.features = geojson.features.map((f) => {
          const newFeature = { ...f };
          try {
            newFeature.properties.properties = JSON.parse(
              newFeature.properties.properties
            );
          } catch (error) {
          } finally {
            return newFeature;
          }
        });

        return setData(geojson);
      }

      setData(defaultData);
    } catch (error) {
      setData(defaultData);
    } finally {
      setDataOrganizationId(id);
      setLoading(false);
    }
  };

  const handleOnTreeSave = (tree: ITree) => {
    const newData = { ...data };
    const index = newData.features.findIndex(
      (f) => f.properties.id === tree.id
    );

    if (index) {
      newData.features[index].properties = tree;
      setData(newData);
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

  const treesLayer = new GeoJsonLayer({
    id: "trees",
    data,
    getLineColor: (d) => {
      if (selection.includes(d.properties.id)) {
        return [255, 0, 0, 100];
      }

      if (activeTree === d.properties.id) {
        return [255, 100, 0];
      }

      for (const key of Object.keys(filters.filters).reverse()) {
        if (
          filters.filters[key] &&
          d.properties.properties &&
          filters.filters[key].includes(d.properties?.properties[key])
        ) {
          const index = filters.options[key].findIndex(
            (f) => f.value === d.properties.properties[key]
          );
          return filters.options[key][index][dark ? "color" : "background"];
        }
      }

      for (let key in filters.filters) {
        if (filters.filters[key].length > 0) {
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

      for (const key of Object.keys(filters.filters).reverse()) {
        if (
          filters.filters[key] &&
          d.properties.properties &&
          filters.filters[key].includes(d.properties?.properties[key])
        ) {
          const index = filters.options[key].findIndex(
            (f) => f.value === d.properties.properties[key]
          );

          return filters.options[key][index][dark ? "color" : "background"];
        }
      }

      for (let key in filters.filters) {
        if (filters.filters[key].length > 0) {
          return [120, 120, 120, 128];
        }
      }

      return [34, 139, 34, 100];
    },
    updateTriggers: {
      getFillColor: [activeTree, selection, editionMode, filters, dark, data],
      getLineColor: [activeTree, selection, editionMode, filters, dark, data],
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

      if (status === 200 && bbox.xmin && bbox.ymin && bbox.xmax && bbox.ymax) {
        const newViewState = layers[0].context.viewport.fitBounds(
          [
            [bbox.xmin, bbox.ymin],
            [bbox.xmax, bbox.ymax],
          ],
          {
            padding: 100,
          }
        );

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
      } else {
        setInitialViewState(defaultViewState);
        setViewState({
          ...defaultViewState,
          transitionDuration: 1000,
          transitionInterpolator: new FlyToInterpolator(),
        });
      }
    } catch (e) {}
  };

  const handleOnFileImported = async (coordinates) => {
    await getData(user.currentOrganization.id);
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

    if (!data) {
      getData(user?.currentOrganization.id);
    }
  }, []);

  const switchPanel = (panel) => {
    if (panel !== "edit") {
      setDrawerLeftWidth(400);
    }

    switch (panel) {
      case "start":
        return setDrawerLeftComponent(
          <PanelStartGeneralInfo numberOfTrees={numberOfTrees} />
        );
      case "info":
        return setDrawerLeftComponent(<TreeSummary treeId={activeTree} />);
      case "edit":
        setDrawerLeftWidth(500);
        return setDrawerLeftComponent(
          <TreeForm treeId={activeTree} onSave={handleOnTreeSave} />
        );
      case "layers":
        return setDrawerLeftComponent(
          <MapLayers
            mapBackground={mapBackground}
            onChangeBackground={(newMapBackground) =>
              setMapbackground(newMapBackground)
            }
          />
        );
      case "import":
        return setDrawerLeftComponent(
          <ImportPanel onFileImported={handleOnFileImported} />
        );
      case "intervention":
        return setDrawerLeftComponent(<InterventionForm />);
      case "intervention-edit":
        return setDrawerLeftComponent(<InterventionsEdit />);
      case "filter":
        return setDrawerLeftComponent(
          <MapFilter
            initialValue={filters.values}
            organizationId={user.currentOrganization.id}
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

  const handleOnFilter = (values, filters, options) => {
    setFilters({
      options,
      filters,
      values,
    });
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
      if (newMode === "edition") {
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
      const { status, data: tree } = await apiETK.delete(url, {
        data: {
          trees: selection,
        },
      });

      if (status === 200) {
        const newData = { ...data };
        newData.features = newData.features.filter(
          (t) => !selection.includes(t.properties.id)
        );

        setData(newData);

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

    if (mode === "selection") {
      return setLayers([treesLayer, selectionLayer]);
    }
  }, [mode]);

  useEffect(() => {
    if (user) {
      setFilters(defaultFilters);
      renderLayers();
      fitToBounds(user?.currentOrganization?.id);

      if (dataOrganizationId !== user.currentOrganization.id) {
        getData(user?.currentOrganization.id).then(() => {
          setNumberOfTrees(data.features.length);
          switchPanel(router.query.panel);
        });
      }
    }
  }, [user]);

  useEffect(() => {
    renderLayers();
  }, [activeTree, editionMode, selection, filters, dark, data]);

  return (
    <AppLayoutCarto
      drawerLeftComponent={drawerLeftComponent}
      drawerLeftWidth={drawerLeftWidth}
      onMapToolbarChange={handleOnMapToolbarChange}
    >
      <Head>
        <title>ecoTeka - Map</title>
      </Head>
      <DeckGL
        viewState={viewState}
        controller={true}
        getCursor={({}) => (mode === "drawPoint" ? "crosshair" : "pointer")}
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
          mapStyle={`/api/v1/maps/style/?theme=${
            dark ? "dark" : "light"
          }&background=${mapBackground}`}
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
      <Box className={classes.actionsBar}>
        <IconButton
          style={{
            color: mapBackground !== "map" ? "#fff" : "",
          }}
          onClick={() => {
            !drawerLeftComponent
              ? switchPanel(router.query.panel)
              : setDrawerLeftComponent();
          }}
        >
          {drawerLeftComponent ? <CloseIcon /> : <MenuOpenIcon />}
        </IconButton>
        <IconButton
          style={{
            color: mapBackground !== "map" ? "#fff" : "",
          }}
          color={router.query?.panel === "start" ? "primary" : "default"}
          onClick={() => router.push("/map?panel=start")}
        >
          <InfoIcon />
        </IconButton>
        <IconButton
          style={{
            color: mapBackground !== "map" ? "#fff" : "",
          }}
          color={router.query?.panel === "filter" ? "primary" : "default"}
          onClick={() => router.push("/map?panel=filter")}
        >
          <SearchIcon />
        </IconButton>
        <IconButton
          style={{
            color: mapBackground !== "map" ? "#fff" : "",
          }}
          color={router.query?.panel === "layers" ? "primary" : "default"}
          onClick={() => router.push("/map?panel=layers")}
        >
          <LayersIcon />
        </IconButton>
        <Can do="create" on="Trees">
          <IconButton
            style={{
              color: mapBackground !== "map" ? "#fff" : "",
            }}
            color={router.query?.panel === "import" ? "primary" : "default"}
            onClick={() => router.push("/map?panel=import")}
          >
            <BackupIcon />
          </IconButton>
        </Can>
      </Box>
      <Hidden smDown>
        <Grid
          container
          justify="center"
          alignItems="center"
          className={classes.toolbar}
        >
          <Grid item className={classes.toolbarAction}>
            <MapModeSwitch
              initValue={editionMode ? "edition" : "analysis"}
              onChange={handleOnMapModeSwitch}
            />
          </Grid>
          <Grid item xs></Grid>
          {editionMode && (
            <Grid item className={classes.toolbarAction}>
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
          <Grid item className={classes.toolbarAction}>
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
          <Grid item className={classes.toolbarAction}>
            <IconButton
              onClick={() => fitToBounds(user.currentOrganization.id)}
            >
              <CenterFocusStrongIcon />
            </IconButton>
          </Grid>
        </Grid>
      </Hidden>
    </AppLayoutCarto>
  );
};

export default EditionPage;
