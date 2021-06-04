import { useState, useRef, useCallback } from "react";
import { createContext, FC, useContext } from "react";
import {
  makeStyles,
  Paper,
  PaperProps,
  Theme,
  Popover,
} from "@material-ui/core";
import DeckGL from "@deck.gl/react";
import { StaticMap } from "react-map-gl";
import { useThemeContext } from "@/lib/hooks/useThemeSwitcher";
import { useEffect } from "react";

export const INITIAL_VIEW_STATE = {
  longitude: 1.1,
  latitude: 46.65,
  zoom: 4,
  pitch: 0,
  bearing: 0,
};

export const MapContext = createContext({} as any);

export interface MapProviderProps {
  width?: number | string;
  height?: number | string;
  borderRadius?: number;
  PaperProps?: PaperProps;
  layers?: any[];
}

export const useMapContext = () => useContext(MapContext);

export type BaseLayer = "map" | "satellite";

const useStyles = makeStyles<Theme, MapProviderProps>((theme) => ({
  root: {
    position: "relative",
    width: ({ width }) => width || "100%",
    height: ({ height }) => height || "100%",
    borderRadius: ({ borderRadius }) => borderRadius || 0,
    overflow: "hidden",
  },
}));

const MapProvider: FC<MapProviderProps> = (props) => {
  const { children, layers: initialLayers = [], PaperProps } = props;
  const { theme } = useThemeContext();
  const classes = useStyles(props);
  const [layers, setLayers] = useState(initialLayers);
  const [baseLayer, setBaseLayer] = useState<BaseLayer>("map");
  const [viewState, setViewState] = useState(INITIAL_VIEW_STATE);
  const [mapStyle, setMapStyle] = useState<string>();
  const [clickInfo, setClickInfo] = useState(null);
  const deckRef = useRef(null);
  const onClick = useCallback((event) => {
    const pickInfo = deckRef.current.pickObject({
      x: event.clientX,
      y: event.clientY,
      radius: 10,
    });
    pickInfo
      ? setClickInfo({
          data: pickInfo.object.properties,
          x: pickInfo.x,
          y: pickInfo.y,
        })
      : setClickInfo(null);
  }, []);

  const handleOnViewStateChange = (e) => {
    setViewState(e.viewState);
  };

  useEffect(() => {
    setMapStyle(
      `/api/v1/maps/style?theme=${theme.palette.type}&background=${baseLayer}`
    );
  }, [theme.palette.type]);

  // useEffect(() => {
  //   console.log(clickInfo);
  // }, [clickInfo]);

  return (
    <MapContext.Provider
      value={{
        baseLayer,
        setBaseLayer,
        layers,
        setLayers,
        viewState,
        setViewState,
        clickInfo,
        setClickInfo,
      }}
    >
      <Paper className={classes.root} {...PaperProps} onClick={onClick}>
        {/* @ts-ignore */}
        <DeckGL
          layers={layers}
          viewState={viewState}
          controller={true}
          onViewStateChange={handleOnViewStateChange}
          ref={deckRef}
        >
          {children}
          <Popover
            open={Boolean(clickInfo?.data?.osm_id)}
            anchorReference="anchorPosition"
            anchorPosition={{
              top: clickInfo ? clickInfo.y : 0,
              left: clickInfo ? clickInfo.x : 0,
            }}
            anchorOrigin={{
              vertical: "top",
              horizontal: "left",
            }}
            transformOrigin={{
              vertical: "top",
              horizontal: "left",
            }}
          >
            {clickInfo?.data.other_tags ? clickInfo.data.other_tags : "Oups"}
          </Popover>
          <StaticMap mapStyle={mapStyle} />
        </DeckGL>
      </Paper>
    </MapContext.Provider>
  );
};

export default MapProvider;
