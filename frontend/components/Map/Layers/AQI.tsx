// @ts-nocheck

import { TileLayer } from "@deck.gl/geo-layers";
import { BitmapLayer } from "@deck.gl/layers";
import { TileLayerProps } from "@deck.gl/geo-layers/tile-layer/tile-layer";

function AQUILayer(
  visible: boolean
): TileLayer<string, TileLayerProps<string>> {
  return new TileLayer({
    id: "aqi",
    data: "https://tiles.aqicn.org/tiles/usepa-aqi/{z}/{x}/{y}.png?token=7bb47d9aadd1ab2b55caef17dc5ac1ca0b3b0209",
    minZoom: 0,
    maxZoom: 19,
    tileSize: 256,
    renderSubLayers: (props) => {
      const {
        bbox: { west, south, east, north },
      } = props.tile;

      return new BitmapLayer(props, {
        data: null,
        image: props.data,
        bounds: [west, south, east, north],
      });
    },
  });
}

export default AQUILayer;
