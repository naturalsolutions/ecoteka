// @ts-nocheck
import { FC } from "react";
import { MVTLayer } from "@deck.gl/geo-layers";
import getConfig from "next/config";
import MapTooltip from "@/components/Map/Tooltip/Tooltip";
import MapTooltipItem from "@/components/Map/Tooltip/Item";
import MapTooltipKeyValue from "@/components/Map/Tooltip/KeyValue";
import { Typography } from "@material-ui/core";

const { publicRuntimeConfig } = getConfig();
const { apiUrl } = publicRuntimeConfig;

const paintPoint = (d) => {
  const spRegex = /species/;
  const genRegex = /genus/;

  if (
    spRegex.test(d.properties.other_tags) ||
    genRegex.test(d.properties.other_tags)
  ) {
    return [34, 169, 54];
  }

  return [147, 168, 180];
};

interface LayerFN {
  visible: boolean;
  onHover?(info): void;
}

function OSMLayer({
  visible,
  onHover,
}: LayerFN): MVTLayer<string, TileLayerProps<string>> {
  return new MVTLayer({
    id: "osm",
    data: `${apiUrl.replace(
      "/api/v1",
      ""
    )}/tiles/osm/{z}/{x}/{y}.pbf?scope=public`,
    minZoom: 0,
    maxZoom: 13,
    opacity: 0.5,
    autoHighlight: true,
    pointRadiusMinPixels: 1,
    pointRadiusScale: 5,
    minRadius: 1,
    radiusMinPixels: 0.5,
    lineWidthMinPixels: 1,
    lineWidthMaxPixels: 1,
    visible: visible,
    pickable: true,
    getLineColor: paintPoint,
    getFillColor: paintPoint,
    onHover,
  });
}

const parseHStore = (hstore): Record<string, string> => {
  return hstore
    .split(",")
    .map((row) => row.split("=>"))
    .reduce((obj, row) => {
      if (row[1]) {
        obj[row[0].replaceAll('"', "")] = row[1].replaceAll('"', "");
      }

      return obj;
    }, {});
};

export const renderTooltipInfo: FC = ({ info }) => {
  let properties = {};

  Object.keys(info.object.properties)
    .filter((k) => !["layerName", "other_tags"].includes(k))
    .reduce((acc, k) => {
      acc[k] = info.object.properties[k];

      return acc;
    }, properties);

  if (info.object?.properties?.other_tags) {
    const parsedProperties = parseHStore(info.object.properties.other_tags);
    properties = {
      ...properties,
      ...parsedProperties,
    };
  }

  return (
    <MapTooltip x={info.x} y={info.y}>
      {properties &&
        Object.keys(properties).map((property) => (
          <MapTooltipItem key={property}>
            <MapTooltipKeyValue
              property={property}
              value={properties[property]}
            />
          </MapTooltipItem>
        ))}
      <MapTooltipItem border={false}>
        <Typography variant="caption">
          source: OSM · https://www.openstreetmap.org
        </Typography>
      </MapTooltipItem>
    </MapTooltip>
  );
};

export default OSMLayer;
