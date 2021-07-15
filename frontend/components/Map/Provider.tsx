import { useState, createContext, FC, useContext } from "react";
import { useThemeContext } from "@/lib/hooks/useThemeSwitcher";
import { useEffect } from "react";
import useLocalStorage from "@/lib/hooks/useLocalStorage";
import { MapLayers } from "@/components/Map/Panel/Layers";
import useApi from "@/lib/useApi";
import { FlyToInterpolator } from "@deck.gl/core";
import { useAppContext } from "@/providers/AppContext";

export const INITIAL_VIEW_STATE = {
  longitude: 1.1,
  latitude: 46.65,
  zoom: 4,
  pitch: 0,
  bearing: 0,
};

export const MapContext = createContext({} as any);

export interface MapProviderProps {
  defaultActiveLayers?: MapLayers;
  layers?: any[];
}

export const useMapContext = () => useContext(MapContext);

export type BaseLayer = "map" | "satellite";

const MapProvider: FC<MapProviderProps> = ({
  defaultActiveLayers = {},
  layers: initialLayers = [],
  children,
}) => {
  const { apiETK } = useApi().api;
  const { theme } = useThemeContext();
  const { organization } = useAppContext();
  const [activeLayers, setActiveLayers] = useLocalStorage(
    "etk:MapProvider:activeLayers",
    defaultActiveLayers
  );
  const [layers, setLayers] = useState(initialLayers);
  const [baseLayer, setBaseLayer] = useLocalStorage<BaseLayer>(
    "etk:MapProvider:baseLayer",
    "map"
  );
  const [viewState, setViewState] = useLocalStorage(
    "etk:MapProvider:viewState",
    INITIAL_VIEW_STATE
  );
  const [mapStyle, setMapStyle] = useLocalStorage<string>(
    "etk:MapProvider:mapStyle"
  );
  const [editionMode, setEditionMode] = useLocalStorage<boolean>(
    "etk:MapProvider:editionMode",
    false
  );
  const [info, setInfo] = useState<Record<string, any>>({});

  useEffect(() => {
    setMapStyle(
      `/api/v1/maps/style?theme=${theme.palette.type}&background=${baseLayer}`
    );
  }, [theme.palette.type, baseLayer]);

  useEffect(() => {
    setLayers([]);

    const currentActiveLayers = Object.keys(activeLayers).filter(
      (activeLayer) => activeLayers[activeLayer].value
    );

    const newLayers = initialLayers
      .filter((layer) => {
        return currentActiveLayers.includes(layer.id);
      })
      .map((layer) => layer.clone());

    setLayers([...newLayers]);
  }, [activeLayers]);

  const fitToBounds = async () => {
    try {
      const { status, data: bbox } = await apiETK.get(`/maps/bbox`, {
        params: {
          organization_id: organization.id,
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

        setViewState({
          ...newViewState,
          transitionDuration: 1000,
          transitionInterpolator: new FlyToInterpolator(),
        });
      }
    } catch (e) {}
  };

  return (
    <MapContext.Provider
      value={{
        activeLayers,
        setActiveLayers,
        baseLayer,
        setBaseLayer,
        layers,
        setLayers,
        viewState,
        setViewState,
        mapStyle,
        setMapStyle,
        editionMode,
        setEditionMode,
        fitToBounds,
        info,
        setInfo,
      }}
    >
      {children}
    </MapContext.Provider>
  );
};

export default MapProvider;
