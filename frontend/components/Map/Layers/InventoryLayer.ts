import { GeoJsonLayer } from "@deck.gl/layers";

export interface InventoryLayerProps {
  data: any;
  selection: any;
  activeTree: number;
  filters: any;
  dark: any;
  editionMode: any;
  visible: boolean;
}

function InventoryLayer<InventoryLayerProps>({
  data,
  selection,
  activeTree,
  filters,
  dark,
  editionMode,
  visible,
}): GeoJsonLayer {
  return new GeoJsonLayer({
    id: "trees",
    data,
    getLineColor: (d) => {
      if (selection.includes(d.properties.id)) {
        return [255, 0, 0, 100];
      }

      if (activeTree === d.properties.id) {
        return [255, 100, 0];
      }

      for (const key of Object.keys(filters.filters).reverse()) {
        if (
          filters.filters[key] &&
          d.properties.properties &&
          filters.filters[key].includes(d.properties?.properties[key])
        ) {
          const index = filters.options[key].findIndex(
            (f) => f.value === d.properties.properties[key]
          );
          const color = filters.options[key][index]["background"]
            .split(",")
            .map((o) => Number(o));

          color.push(128);

          return color;
        }
      }

      for (let key in filters.filters) {
        if (filters.filters[key].length > 0) {
          return [120, 120, 120, 128];
        }
      }

      return [34, 169, 54, 100];
    },
    getFillColor: (d) => {
      if (selection.includes(d.properties.id)) {
        return [255, 0, 0, 100];
      }

      for (const key of Object.keys(filters.filters).reverse()) {
        if (
          filters.filters[key] &&
          d.properties.properties &&
          filters.filters[key].includes(d.properties?.properties[key])
        ) {
          const index = filters.options[key].findIndex(
            (f) => f.value === d.properties.properties[key]
          );
          const color = filters.options[key][index]["background"]
            .split(",")
            .map((o) => Number(o));

          color.push(128);

          return color;
        }
      }

      for (let key in filters.filters) {
        if (filters.filters[key].length > 0) {
          return [120, 120, 120, 128];
        }
      }

      return [34, 139, 34, 100];
    },
    getRadius: (d) => {
      if (d.properties?.properties?.diameter) {
        const diameter = Number(d.properties.properties.diameter);

        if (diameter >= 0 && diameter < 40) {
          return 1.25;
        } else if (diameter >= 40 && diameter < 100) {
          return 1.5;
        } else {
          return 1.75;
        }
      }

      return 1;
    },
    updateTriggers: {
      getFillColor: [activeTree, selection, editionMode, filters, dark, data],
      getLineColor: [activeTree, selection, editionMode, filters, dark, data],
      getRadius: [activeTree, selection, editionMode, filters, dark, data],
    },
    pickable: true,
    autoHighlight: true,
    pointRadiusMinPixels: 5,
    pointRadiusScale: 1,
    minRadius: 2,
    radiusMinPixels: 0.5,
    lineWidthMinPixels: 1,
    lineWidthMaxPixels: 3,
    visible: visible,
  });
}

export default InventoryLayer;
