// @ts-nocheck
import { FC } from "react";
import { MVTLayer } from "@deck.gl/geo-layers";
import { TileLayerProps } from "@deck.gl/geo-layers/tile-layer/tile-layer";
import MapTooltip from "@/components/Map/Tooltip/Tooltip";
import MapTooltipItem from "@/components/Map/Tooltip/Item";
import MapTooltipKeyValue from "@/components/Map/Tooltip/KeyValue";
import { Typography } from "@material-ui/core";

function CadastreLayer(
  visible: boolean
): MVTLayer<string, TileLayerProps<string>> {
  return new MVTLayer({
    id: "cadastre",
    data: "https://openmaptiles.geo.data.gouv.fr/data/cadastre/{z}/{x}/{y}.pbf",
    minZoom: 13,
    maxZoom: 20,
    getLineColor: [192, 192, 192, 100],
    getFillColor: (f) => {
      switch (f.properties.layerName) {
        case "sections":
          return [140, 170, 180, 100];
        case "parcelles":
          return [128, 45, 27, 100];
        case "batiments":
          return [200, 256, 56, 100];
        default:
          return [26, 189, 17, 0];
      }
    },
    pickable: true,
    visible: visible,
  });
}

export const renderTooltipInfo: FC = ({ info, title }) => {
  return (
    <MapTooltip x={info.x} y={info.y}>
      <Typography variant="h5">{title}</Typography>
      {info.object.properties &&
        Object.keys(info.object.properties).map((property) => (
          <MapTooltipItem key={property}>
            <MapTooltipKeyValue
              property={property}
              value={info.object.properties[property]}
            />
          </MapTooltipItem>
        ))}
      <MapTooltipItem border={false}>
        <Typography variant="caption">
          source: Etalab · https://openmaptiles.geo.data.gouv.fr
        </Typography>
      </MapTooltipItem>
    </MapTooltip>
  );
};

export default CadastreLayer;
