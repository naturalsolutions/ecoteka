import { FC } from "react";
import { StaticMap } from "react-map-gl";

import { Typography } from "@material-ui/core";
import { useMapContext } from "@/components/Map/Provider";
import ContainerBase, {
  MapContainerBaseProps,
} from "@/components/Map/ContainerBase";
import MapAttributionList from "@/components/Map/Attribution/List";
import MapAttributionItem from "@/components/Map/Attribution/Item";
import MapTooltip from "@/components/Map/Tooltip/Tooltip";
import MapTooltipItem from "@/components/Map/Tooltip/Item";
import MapTooltipKeyValue from "@/components/Map/Tooltip/KeyValue";

export interface MapContainerProps extends MapContainerBaseProps {}

const MapContainer: FC<MapContainerProps> = ({
  children,
  PaperProps,
  height,
  width,
  endComponent,
  startComponent,
  DeckGLProps,
}) => {
  const { mapStyle, info } = useMapContext();

  return (
    <ContainerBase
      height={height}
      width={width}
      PaperProps={PaperProps}
      startComponent={startComponent}
      endComponent={endComponent}
      DeckGLProps={DeckGLProps}
    >
      <StaticMap mapStyle={mapStyle} attributionControl={false} />
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
      {children}
      {info && (
        <MapTooltip x={info.x} y={info.y}>
          <Typography variant="h5">{info.title}</Typography>
          {info.properties &&
            Object.keys(info.properties).map((property) => (
              <MapTooltipItem key={property}>
                <MapTooltipKeyValue
                  property={property}
                  value={info.properties[property]}
                />
              </MapTooltipItem>
            ))}
          <MapTooltipItem border={false}>
            <Typography variant="caption">{info.source}</Typography>
          </MapTooltipItem>
        </MapTooltip>
      )}
    </ContainerBase>
  );
};

export default MapContainer;
