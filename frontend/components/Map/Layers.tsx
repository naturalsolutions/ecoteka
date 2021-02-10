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
  Typography,
} from "@material-ui/core";

export interface IMapLayers {
  mapBackground: string;
  onChangeBackground?(background: string): void;
}

const MapLayers: FC<IMapLayers> = ({ mapBackground, onChangeBackground }) => {
  const { t } = useTranslation("components");

  const [background, setBackground] = useState(mapBackground);
  const [layers, setLayers] = useState({
    cadastre: true,
    osm: true,
    trees: true,
  });

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = (event.target as HTMLInputElement).value;
    setBackground(value);
    onChangeBackground(value);
  };

  const handleLayerChange = (event: React.ChangeEvent<HTMLInputElement>) => {};

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

export default MapLayers;
