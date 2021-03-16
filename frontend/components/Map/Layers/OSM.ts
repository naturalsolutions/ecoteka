import { MVTLayer } from "@deck.gl/geo-layers";
import getConfig from "next/config";

const { publicRuntimeConfig } = getConfig();
const { apiUrl } = publicRuntimeConfig;

function OSMLayer(visible: boolean): MVTLayer {
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
    pointRadiusMinPixels: 5,
    pointRadiusScale: 1,
    minRadius: 2,
    radiusMinPixels: 0.5,
    lineWidthMinPixels: 1,
    lineWidthMaxPixels: 3,
    getLineColor: [192, 192, 192],
    getFillColor: [140, 170, 180],
    visible: visible,
  });
}

export default OSMLayer;
