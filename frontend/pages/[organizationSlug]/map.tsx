// @ts-nocheck
import { useEffect, useState } from "react";
import {
  Grid,
  makeStyles,
  CircularProgress,
  LinearProgress,
  Typography,
  SvgIcon,
  useMediaQuery,
  useTheme,
} from "@material-ui/core";
import CenterFocusStrongIcon from "@material-ui/icons/CenterFocusStrong";
import SelectIcon from "@material-ui/icons/PhotoSizeSelectSmall";
import MyLocationIcon from "@material-ui/icons/MyLocation";
import useApi from "@/lib/useApi";
import { useAppContext } from "@/providers/AppContext";
import { useRouter } from "next/router";
import { TMapToolbarAction } from "@/components/Map/Toolbar";
import MapLayers, {
  ILayers,
  defaultLayers,
  IMapLayers,
} from "@/components/Map/Layers";
import MapFilter from "@/components/Map/Filter";
import MapDeleteTrees from "@/components/Map/DeleteTrees";
import useLocalStorage from "@/lib/hooks/useLocalStorage";
import { useThemeContext } from "@/lib/hooks/useThemeSwitcher";
import AppLayoutCarto from "@/components/AppLayout/Carto";
import PanelStartGeneralInfo from "@/components/Panel/Start/GeneralInfo";
import MapSearchCity from "@/components/Map/SearchCity";
import ImportPanel from "@/components/Import/Panel/Index";
import InterventionForm from "@/components/Interventions/Form";
import { FlyToInterpolator } from "@deck.gl/core";
import DeckGL from "@deck.gl/react";
import { SelectionLayer } from "nebula.gl";
import { StaticMap } from "react-map-gl";
import OSMLayer from "@/components/Map/Layers/OSM";
import CadastreLayer, {
  renderTooltipInfo as renderTooltipInfoCadastre,
} from "@/components/Map/Layers/Cadastre";
import InventoryLayer from "@/components/Map/Layers/InventoryLayer.ts";
import Head from "next/head";
import InterventionsEdit from "@/components/Interventions/Panel/Panel";
import geobuf from "geobuf";
import Pbf from "pbf";
import { useTranslation } from "react-i18next";
import MapActionsBar, {
  MapActionsBarActionType,
} from "@/components/Map/ActionsBar";
import TreePanel from "@/components/Tree/Panel";
import MapActionsList from "@/components/Map/Actions/List";
import MapActionsAction from "@/components/Map/Actions/Action";
import IconTree from "@/public/assets/icons/icon_tree.svg";
import MapAttributionList from "@/components/Map/Attribution/List";
import MapAttributionItem from "@/components/Map/Attribution/Item";

const useStyles = makeStyles((theme) => ({
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
  fabProgress: {
    position: "absolute",
    bottom: theme.spacing(2),
    right: theme.spacing(8),
    zIndex: 1,
  },
  organizationLoadProgress: {
    width: "100%",
  },
}));

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

const OrganizationLoadProgress = ({}) => {
  const classes = useStyles();
  return (
    <div className={classes.organizationLoadProgress}>
      <LinearProgress />
    </div>
  );
};

const rendersTooltip = {
  cadastre: renderTooltipInfoCadastre,
};

const EditionPage = ({}) => {
  const { t } = useTranslation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const classes = useStyles();
  const router = useRouter();
  const { organization, user, isOrganizationLoading } = useAppContext();
  const { dark } = useThemeContext();
  const { apiETK } = useApi().api;
  const [data, setData] = useLocalStorage("etk:map:data");
  const [drawerLeftComponent, setDrawerLeftComponent] = useState();
  const [drawerLeftWidth] = useState(550);
  const [initialViewState, setInitialViewState] = useLocalStorage(
    "etk:map:viewstate",
    defaultViewState
  );
  const [loadDataProgress, setLoadDataProgress] = useState(0);
  const [viewState, setViewState] = useState();
  const [mode, setMode] = useState("");
  const [filters, setFilters] = useState(defaultFilters);
  const [selection, setSelection] = useState([]);
  const [editionMode, setEditionMode] = useState<boolean>(false);
  const [mapBackground, setMapbackground] = useLocalStorage(
    "etk:map:mapBackground",
    "map"
  );
  const [layers, setLayers] = useState([]);
  const [activeLayers, setActiveLayers] = useLocalStorage<IMapLayers>(
    "etk:map:activeLayers",
    defaultLayers
  );
  const [activeTree, setActiveTree] = useState<number | undefined>(
    router.query?.tree ? Number(router.query.tree) : undefined
  );
  const [loading, setLoading] = useState(false);

  const [info, setInfo] = useState<Record<string, any>>({});

  const cadastreLayer = CadastreLayer(activeLayers.cadastre.value);
  const osmLayer = OSMLayer({
    visible: true,
    defaultPointColor: "#7EC14D",
  });
  const treesLayer = InventoryLayer({
    visible: activeLayers.trees.value,
    data,
    filters,
    dark,
    selection,
    activeTree,
    editionMode,
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

  const createTree = async (x, y) => {
    try {
      const organizationId = organization.id;
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

        if (!isMobile) {
          router.push({
            pathname: "/[organizationSlug]/map",
            query: {
              panel: "info",
              tree: tree.id,
              organizationSlug: organization.slug,
            },
          });
        } else {
          router.push({
            pathname: "/[organizationSlug]/tree/[id]",
            query: {
              id: tree.id,
              organizationSlug: organization.slug,
            },
          });
        }

        setActiveTree(tree.id);
      }
    } catch (error) {
    } finally {
      if (isMobile) {
        setEditionMode(false);
      }
    }
  };

  const getData = async (id: number) => {
    try {
      setLoading(true);
      const { status, data: newData } = await apiETK.get(
        `/maps/geobuf?organization_id=${id}`,
        {
          onDownloadProgress: ({ loaded, total }) => {
            const progress = Math.floor((loaded / total) * 100);

            setLoadDataProgress(progress);
          },
          responseType: "arraybuffer",
        }
      );

      setData(defaultData);

      if (status === 200 && newData) {
        const pbf = new Pbf(newData);
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

        setData(geojson);
        setLoadDataProgress(0);
      }
    } catch (error) {
      setData(defaultData);
    } finally {
      setLoading(false);
    }
  };

  const handleOnChangeLayers = (newActiveLayers: ILayers) => {
    setActiveLayers(newActiveLayers);
    renderLayers();
  };

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
    await getData(organization.id);
    setViewState({
      longitude: coordinates[0],
      latitude: coordinates[1],
      zoom: 15,
      transitionDuration: 1200,
      transitionInterpolator: new FlyToInterpolator(),
    });
  };

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
        fitToBounds(organization.id);
        break;
    }
  };

  const handleOnDeleteTrees = async () => {
    if (!selection.length) {
      return;
    }

    try {
      const url = `/organization/${organization.id}/trees/bulk_delete`;
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
          router.push({
            pathname: "/[organizationSlug]/map",
            query: {
              panel: "start",
              organizationSlug: organization.slug,
            },
          });
          setActiveTree();
          setDrawerLeftComponent();
        }

        setSelection([]);
      }
    } catch (e) {}
  };

  const renderLayers = () => {
    if (editionMode && mode === "selection") {
      return setLayers([
        cadastreLayer.clone({ visible: activeLayers.cadastre.value }),
        treesLayer.clone({ visible: true }),
        selectionLayer,
      ]);
    }

    if (editionMode) {
      return setLayers([treesLayer.clone({ visible: true })]);
    }

    return setLayers([
      cadastreLayer.clone({ visible: activeLayers.cadastre.value }),
      osmLayer.clone({
        visible: activeLayers.osm.value,
        defaultPointColor: "#7EC14D",
      }),
      treesLayer.clone({ visible: activeLayers.trees.value }),
    ]);
  };

  const handleOnMapActionsBarClick = (action: MapActionsBarActionType) => {
    router.push({
      pathname: "/[organizationSlug]/map",
      query: {
        ...router.query,
        panel: action,
        organizationSlug: organization.slug,
      },
    });
  };

  const toggleAction = (isEditionMode: boolean, newMode: string) => {
    mode == "" || mode == newMode
      ? setEditionMode(!isEditionMode)
      : setEditionMode(true);
    isEditionMode && mode == newMode ? setMode("") : setMode(newMode);
  };

  const handleOnMapLoad = () => {
    router.query?.tree
      ? flyToTree(Number(router.query.tree))
      : fitToBounds(organization.id);
  };

  const handleOnViewStateChange = (e) => {
    const { longitude, latitude, zoom } = e.viewState;

    setInitialViewState({
      longitude,
      latitude,
      zoom,
    });
    setViewState(e.viewState);
  };

  const handleOnMapClick = (info) => {
    if (editionMode && mode === "drawPoint") {
      setMode("selection");
      const [x, y] = info.coordinate;

      return createTree(x, y);
    }

    if (info.object?.properties?.id && info.layer?.id == "trees") {
      if (!isMobile) {
        router.push({
          pathname: "/[organizationSlug]/map",
          query: {
            panel: "info",
            tree: info.object?.properties.id,
            organizationSlug: organization.slug,
          },
        });
      } else {
        router.push({
          pathname: "/[organizationSlug]/tree/[id]",
          query: {
            id: info.object?.properties.id,
            organizationSlug: organization.slug,
          },
        });
      }
    }
  };

  const handleOnMapHover = (newInfo) => {
    setInfo(undefined);
    if (newInfo.picked && newInfo.layer?.id == "cadastre" && newInfo.object) {
      setInfo(newInfo);
    }
  };

  useEffect(() => {
    if (mode !== "selection") {
      setSelection([]);
      setLayers([osmLayer, treesLayer]);
    } else {
      setLayers([treesLayer, selectionLayer]);
    }
  }, [mode]);

  useEffect(() => {
    if (organization) {
      if (["open", "participatory"].includes(organization.mode)) {
        setActiveLayers({
          ...activeLayers,
          osm: {
            ...activeLayers.osm,
            value: true,
          },
        });
      } else {
        setActiveLayers({
          ...activeLayers,
          osm: {
            ...activeLayers.osm,
            value: false,
          },
        });
      }

      setFilters(defaultFilters);
      renderLayers();

      getData(organization.id);
      fitToBounds(organization.id);
    }
  }, [organization]);

  const flyToTree = async (treeId: number) => {
    try {
      const { status, data: tree } = await apiETK.get(
        `/organization/${organization.id}/trees/${treeId}`
      );

      if (status == 200) {
        setViewState({
          longitude: tree.x,
          latitude: tree.y,
          zoom: 20,
          transitionDuration: 1200,
          transitionInterpolator: new FlyToInterpolator({ speed: 2 }),
        });
      }
    } catch (e) {}
  };

  useEffect(() => {
    if (router.query?.tree) {
      setActiveTree(Number(router.query.tree));
      flyToTree(Number(router.query.tree));
    }
  }, [router.query.tree]);

  useEffect(() => {
    renderLayers();
  }, [activeTree, editionMode, selection, filters, dark, data]);

  useEffect(() => {
    setViewState({ ...initialViewState });
  }, []);

  if (!organization) {
    return <></>;
  }

  return (
    <AppLayoutCarto
      drawerLeftComponent={drawerLeftComponent}
      drawerLeftWidth={drawerLeftWidth}
      onMapToolbarChange={handleOnMapToolbarChange}
      isLoading={isOrganizationLoading && Boolean(organization)}
      Skeleton={<OrganizationLoadProgress />}
    >
      <Head>
        <title>ecoTeka - Map</title>
      </Head>
      <DeckGL
        viewState={viewState}
        controller={true}
        getCursor={({}) => (mode === "drawPoint" ? "crosshair" : "pointer")}
        layers={layers}
        onLoad={handleOnMapLoad}
        onViewStateChange={handleOnViewStateChange}
        onClick={handleOnMapClick}
        onHover={handleOnMapHover}
      >
        <StaticMap
          mapStyle={`/api/v1/maps/style?theme=${
            dark ? "dark" : "light"
          }&background=${mapBackground}`}
        ></StaticMap>
        {loading && (
          <div className={classes.fabProgress}>
            <Grid
              container
              justifyContent="center"
              alignItems="center"
              spacing={2}
            >
              <Grid item>
                <Typography color="textPrimary">
                  {t("common.loading")}
                </Typography>
              </Grid>
              <Grid item>
                <CircularProgress
                  color="primary"
                  variant="determinate"
                  size={30}
                  thickness={10}
                  value={loadDataProgress}
                />
              </Grid>
            </Grid>
          </div>
        )}
        <MapAttributionList>
          <MapAttributionItem
            href="https://maptiler.com/copyright"
            label="© MapTiler"
          />
          <MapAttributionItem
            href="https://www.openstreetmap.org/copyright"
            label="© OpenStreetMap"
          />
        </MapAttributionList>
      </DeckGL>

      <Grid
        container
        justifyContent="center"
        alignItems="center"
        className={classes.toolbar}
      >
        <Grid item xs></Grid>
        {info?.layer?.id &&
          rendersTooltip[info.layer.id] &&
          rendersTooltip[info.layer.id]({
            info,
            title: t("components.Map.Layers.Cadastre.title"),
          })}
        <Grid item className={classes.toolbarAction}>
          <MapDeleteTrees
            active={Boolean(selection.length)}
            message={
              selection.length > 0
                ? `${t("common.treesWithCount", {
                    count: selection.length,
                  })}`
                : null
            }
            onDelete={handleOnDeleteTrees}
          />
        </Grid>
        <Grid item xs></Grid>
        <Grid item className={classes.toolbarAction}>
          {!isMobile && (
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
          )}
        </Grid>
      </Grid>
      <MapActionsList>
        {navigator?.geolocation && (
          <MapActionsAction
            name={t("common.geolocate")}
            icon={<MyLocationIcon color="primary" />}
            onClick={() => {
              navigator.geolocation.getCurrentPosition((position) => {
                setViewState({
                  ...viewState,
                  longitude: position.coords.longitude,
                  latitude: position.coords.latitude,
                  zoom: 16,
                  transitionDuration: 1500,
                  transitionInterpolator: new FlyToInterpolator(),
                });
              });
            }}
          />
        )}
        <MapActionsAction
          name={t("common.fitToBounds")}
          icon={<CenterFocusStrongIcon color="primary" />}
          onClick={() => fitToBounds(organization.id)}
        />
        <MapActionsAction
          action={"delete"}
          subject={"Trees"}
          isActive={editionMode && mode == "selection"}
          name={
            editionMode && mode == "selection"
              ? t("common.disableSelectTrees")
              : t("common.activateSelectTrees")
          }
          icon={
            <SelectIcon
              htmlColor={
                editionMode && mode == "selection" ? "white" : "#46b9b1"
              }
            />
          }
          onClick={() => toggleAction(editionMode, "selection")}
        />
        <MapActionsAction
          dataTest="add-tree-button"
          isActive={editionMode && mode == "drawPoint"}
          action={"create"}
          subject={"Trees"}
          name={
            editionMode && mode == "drawPoint"
              ? t("common.disableDrawTree")
              : t("common.activateDrawTree")
          }
          icon={
            <SvgIcon
              htmlColor={
                editionMode && mode == "drawPoint" ? "white" : "#46b9b1"
              }
              component={IconTree}
              viewBox="0 0 24 32"
            />
          }
          onClick={() => toggleAction(editionMode, "drawPoint")}
        />
      </MapActionsList>
      <ImportPanel onFileImported={handleOnFileImported} />
      <InterventionForm />
      <InterventionsEdit />
      <MapFilter
        initialValue={filters.values}
        organizationId={organization.id}
        onChange={handleOnFilter}
      />
      <MapLayers
        layers={activeLayers}
        mapBackground={mapBackground}
        onChangeBackground={(newMapBackground) =>
          setMapbackground(newMapBackground)
        }
        onChangeLayers={handleOnChangeLayers}
      />
      <PanelStartGeneralInfo numberOfTrees={data?.features.length} />
      <MapActionsBar
        isMenuOpen={drawerLeftComponent !== undefined}
        darkBackground={mapBackground !== "map"}
        onClick={handleOnMapActionsBarClick}
      />
      <TreePanel withEditMode={editionMode} />
    </AppLayoutCarto>
  );
};

export default EditionPage;
