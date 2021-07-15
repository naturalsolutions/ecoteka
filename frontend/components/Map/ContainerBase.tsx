import { FC, ReactElement, useRef } from "react";
import DeckGL from "@deck.gl/react";
import { makeStyles, Theme, Paper, PaperProps } from "@material-ui/core";

import { useMapContext } from "@/components/Map/Provider";

export interface MapContainerBaseProps {
  width?: number | string;
  height?: number | string;
  borderRadius?: number;
  startComponent?: ReactElement;
  endComponent?: ReactElement;
  PaperProps?: PaperProps;
  DeckGLProps?: any;
}

export interface MapContainerBaseThemeProps {
  width?: number | string;
  height?: number | string;
  borderRadius?: number;
}

const useStyles = makeStyles<Theme, MapContainerBaseThemeProps>(
  (theme: Theme) => ({
    root: {
      position: "relative",
      width: ({ width }) => width || "100%",
      height: ({ height }) => height || "100%",
      borderRadius: ({ borderRadius }) => borderRadius || 0,
      overflow: "hidden",
    },
  })
);

const MapContainerBase: FC<MapContainerBaseProps> = ({
  height,
  width,
  borderRadius,
  startComponent,
  endComponent,
  children,
  PaperProps,
  DeckGLProps,
}) => {
  const classes = useStyles({
    height,
    width,
    borderRadius,
  });
  const { layers, viewState, setViewState } = useMapContext();

  const handleOnViewStateChange = (e) => {
    setViewState(e.viewState);
  };

  return (
    <Paper className={classes.root} {...PaperProps}>
      <div>{startComponent}</div>
      {/* @ts-ignore */}
      <DeckGL
        layers={layers}
        viewState={viewState}
        controller={true}
        onViewStateChange={handleOnViewStateChange}
        {...DeckGLProps}
      >
        {children}
      </DeckGL>
      <div>{endComponent}</div>
    </Paper>
  );
};

export default MapContainerBase;
