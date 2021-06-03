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
    autoHighlight: true,
    pointRadiusMinPixels: 2,
    pointRadiusScale: 1,
    minRadius: 4,
    radiusMinPixels: 0.5,
    lineWidthMinPixels: 1,
    lineWidthMaxPixels: 1,
    getLineColor: [50, 152, 26],
    getFillColor: [85, 245, 0],
    visible: visible,
    onClick: (info, event) => console.log("Clicked:", info.object.properties),
  });
}

export default OSMLayer;
