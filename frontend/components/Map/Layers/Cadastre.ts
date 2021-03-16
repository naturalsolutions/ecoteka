// @ts-nocheck
import { MVTLayer } from "@deck.gl/geo-layers";
import { TileLayerProps } from "@deck.gl/geo-layers/tile-layer/tile-layer";

function CadastreLayer(
  visible: boolean
): MVTLayer<string, TileLayerProps<string>> {
  return new MVTLayer({
    id: "cadastre",
    data: "https://openmaptiles.geo.data.gouv.fr/data/cadastre/{z}/{x}/{y}.pbf",
    minZoom: 11,
    maxZoom: 16,
    getLineColor: [192, 192, 192, 100],
    getFillColor: [140, 170, 180, 100],
    pickable: true,
    visible: visible,
  });
}

export default CadastreLayer;
