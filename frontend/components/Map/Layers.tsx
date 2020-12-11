import { FC, useEffect, useState, memo } from "react";
import { useTranslation } from "react-i18next";
import {
  Checkbox,
  Divider,
  FormControl,
  FormControlLabel,
  FormLabel,
  Grid,
  Radio,
  RadioGroup,
} from "@material-ui/core";
import MapGL from "@urbica/react-map-gl";

export interface IMapLayers {
  map: MapGL;
}

const excludeLayers = [
  "background",
  "landuse_residential",
  "landcover_grass",
  "landcover_wood",
  "water",
  "water_intermittent",
  "landcover_ice-shelf",
  "landcover_glacier",
  "landcover_sand",
  "waterway_tunnel",
  "waterway",
  "waterway_intermittent",
  "tunnel_railway_transit",
  "building",
  "road_area_pier",
  "road_pier",
  "road_bridge_area",
  "road_path",
  "road_minor",
  "tunnel_minor",
  "tunnel_major",
  "aeroway_area",
  "aeroway_taxiway",
  "aeroway_runway",
  "road_trunk_primary",
  "road_secondary_tertiary",
  "road_major_motorway",
  "railway_transit",
  "railway",
  "waterway-bridge-case",
  "waterway-bridge",
  "bridge_minor case",
  "bridge_major case",
  "bridge_minor",
  "bridge_major",
  "satellite",
  "admin_sub",
  "admin_country_z0-4",
  "admin_country_z5-",
  "airport_label",
  "road_major_label",
  "place_label_other",
  "place_label_city",
  "country_label-other",
  "country_label",
];

const MapLayers: FC<IMapLayers> = ({ map }) => {
  const { t } = useTranslation("components");
  const mapCurrent = map.current?.getMap();

  const initialLayers = mapCurrent
    ? mapCurrent
        .getStyle()
        .layers.filter((l) => !excludeLayers.includes(l.id))
        .reduce(
          (a, l) => ({ ...a, [l.id]: l.layout?.visibility !== "none" }),
          {}
        )
    : [];

  const [backgroundLayer, setBackgroundLayer] = useState("map");
  const [layers, setLayers] = useState(initialLayers);

  useEffect(() => {
    if (mapCurrent && typeof mapCurrent.getStyle === "function") {
      const satelliteLayer = mapCurrent
        .getStyle()
        .layers.find((l) => l.id === "satellite");

      if (satelliteLayer) {
        setBackgroundLayer(
          satelliteLayer.layout.visibility === "none" ? "map" : "satellite"
        );
      }
    }
  }, [mapCurrent]);

  useEffect(() => {
    if (mapCurrent) {
      mapCurrent.setLayoutProperty(
        "satellite",
        "visibility",
        backgroundLayer === "map" ? "none" : "visible"
      );
    }
  }, [backgroundLayer, mapCurrent]);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setBackgroundLayer((event.target as HTMLInputElement).value);
  };

  const handleLayerChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    mapCurrent.setLayoutProperty(
      event.target.name,
      "visibility",
      event.target.checked ? "visible" : "none"
    );

    setLayers({ ...layers, [event.target.name]: event.target.checked });
  };

  return (
    <Grid container direction="column" spacing={3}>
      <Grid item>
        <FormControl component="fieldset">
          <FormLabel component="legend">{t("MapLayers.backgrounds")}</FormLabel>
          <RadioGroup
            name="background"
            value={backgroundLayer}
            onChange={handleChange}
          >
            <FormControlLabel
              value="map"
              control={<Radio color="primary" />}
              label="Map"
            />
            <FormControlLabel
              value="satellite"
              control={<Radio color="primary" />}
              label="Satellite"
            />
          </RadioGroup>
        </FormControl>
      </Grid>
      <Divider />
      <Grid item>
        <FormControl component="fieldset">
          <FormLabel component="legend">{t("MapLayers.layers")}</FormLabel>
          {Object.keys(layers).map((layer) => (
            <FormControlLabel
              key={layer}
              value={layers[layer]}
              onChange={handleLayerChange}
              control={
                <Checkbox
                  checked={layers[layer]}
                  color="primary"
                  name={layer}
                />
              }
              label={layer}
            />
          ))}
        </FormControl>
      </Grid>
    </Grid>
  );
};

export default memo(MapLayers);
