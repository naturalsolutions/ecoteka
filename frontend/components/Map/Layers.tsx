import { FC, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  Divider,
  FormControl,
  FormControlLabel,
  FormLabel,
  Grid,
  Radio,
  RadioGroup,
  Checkbox,
} from "@material-ui/core";
import { AppLayoutCartoDialog } from "../AppLayout/Carto";
import { useRouter } from "next/router";
import BackToMap from "./BackToMap";

export const defaultLayers = {
  cadastre: {
    name: "Cadastre",
    value: false,
  },
  osm: {
    name: "Open Street Map (OSM)",
    value: false,
    defaultPointColor: "#7EC14D",
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
  const [active, setActive] = useState<boolean>(false);
  const { t } = useTranslation("components");
  const [background, setBackground] = useState(mapBackground);
  const router = useRouter();

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

  useEffect(() => {
    const { query, route } = router;

    if (route === "/[organizationSlug]/map" && query.panel === "layers") {
      setActive(true);
    } else {
      setActive(false);
    }
  }, [router.query]);

  return (
    active && (
      <AppLayoutCartoDialog
        title={t("components.Map.Layers.title")}
        actions={<BackToMap />}
      >
        <Grid container direction="column" spacing={3}>
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
                <FormControlLabel
                  value="ign"
                  control={<Radio color="primary" />}
                  label="Plan IGN"
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
                .map((key: string) => {
                  const label = t("components.Map.Layers.defaultLayers", {
                    returnObjects: true,
                  })[key];

                  return (
                    <FormControlLabel
                      key={key}
                      label={label}
                      control={
                        <Checkbox
                          color="primary"
                          checked={layers[key].value}
                          onChange={() => handleLayerChange(key, layers[key])}
                          name={key}
                        />
                      }
                    />
                  );
                })}
            </FormControl>
          </Grid>
        </Grid>
      </AppLayoutCartoDialog>
    )
  );
};

export default MapLayers;
