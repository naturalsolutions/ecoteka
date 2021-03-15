import { FC, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  Divider,
  FormControl,
  FormControlLabel,
  FormLabel,
  Grid,
  Radio,
  RadioGroup,
  Typography,
  Checkbox,
} from "@material-ui/core";

export const defaultLayers = {
  cadastre: {
    name: "Cadastre",
    value: false,
  },
  osm: {
    name: "Open Street Map (OSM)",
    value: true,
  },
  trees: {
    name: "Trees",
    value: true,
  },
};

export interface IMapLayer {
  name: string;
  value: boolean;
}

export interface IMapLayers {
  [key: string]: IMapLayer;
}

export interface IMapLayersProps {
  mapBackground: string;
  layers: IMapLayers;
  onChangeBackground?(background: string): void;
  onChangeLayers?(layers): void;
}

const MapLayers: FC<IMapLayersProps> = ({
  mapBackground,
  layers,
  onChangeBackground,
  onChangeLayers,
}) => {
  const { t } = useTranslation("components");
  const [background, setBackground] = useState(mapBackground);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = (event.target as HTMLInputElement).value;

    setBackground(value);
    onChangeBackground(value);
  };

  const handleLayerChange = (key: string, layer: IMapLayer) => {
    const newLayers = { ...layers } as IMapLayers;

    newLayers[key].value = !layer.value;
    onChangeLayers(newLayers);
  };

  return (
    <Grid container direction="column" spacing={3}>
      <Grid item>
        <Typography variant="h6">{t("components.Map.Layers.title")}</Typography>
      </Grid>
      <Grid item>
        <FormControl component="fieldset">
          <FormLabel component="legend">
            {t("components.MapLayers.backgrounds")}
          </FormLabel>
          <RadioGroup
            name="background"
            value={background}
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
          <FormLabel component="legend">
            {t("components.MapLayers.layers")}
          </FormLabel>
          {Object.keys(layers)
            .sort()
            .map((key: string) => (
              <FormControlLabel
                key={key}
                label={
                  t("components.Map.Layers.defaultLayers", {
                    returnObjects: true,
                  })[key]
                }
                control={
                  <Checkbox
                    color="primary"
                    checked={layers[key].value}
                    onChange={() => handleLayerChange(key, layers[key])}
                    name={key}
                  />
                }
              />
            ))}
        </FormControl>
      </Grid>
    </Grid>
  );
};

export default MapLayers;
