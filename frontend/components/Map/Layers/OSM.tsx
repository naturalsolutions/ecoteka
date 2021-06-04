// @ts-nocheck
import { MVTLayer } from "@deck.gl/geo-layers";
import getConfig from "next/config";

const { publicRuntimeConfig } = getConfig();
const { apiUrl } = publicRuntimeConfig;

function OSMLayer(visible: boolean): MVTLayer<string, TileLayerProps<string>> {
  return new MVTLayer({
    id: "osm",
    data: `${apiUrl.replace(
      "/api/v1",
      ""
    )}/tiles/osm/{z}/{x}/{y}.pbf?scope=public`,
    minZoom: 0,
    maxZoom: 13,
    pickable: true,
    opacity: 0.5,
    autoHighlight: true,
    pointRadiusMinPixels: 1,
    pointRadiusScale: 5,
    minRadius: 1,
    radiusMinPixels: 0.5,
    lineWidthMinPixels: 1,
    lineWidthMaxPixels: 1,
    getLineColor: (d) => {
      const spRegex = /species/;
      const genRegex = /genus/;
      if (
        spRegex.test(d.properties.other_tags) ||
        genRegex.test(d.properties.other_tags)
      ) {
        return [34, 169, 54];
      } else {
        return [147, 168, 180];
      }
    },
    getFillColor: (d) => {
      const spRegex = /species/;
      const genRegex = /genus/;
      if (
        spRegex.test(d.properties.other_tags) ||
        genRegex.test(d.properties.other_tags)
      ) {
        return [34, 169, 54];
      } else {
        return [147, 168, 180];
      }
    },
    visible: visible,
    onClick: (info, event) => {
      console.log("Clicked:", info.object.properties);
    },
  });
}

export default OSMLayer;
