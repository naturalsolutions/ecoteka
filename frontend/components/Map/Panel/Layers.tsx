import { FC, useEffect, useState } from "react";
import { useRouter } from "next/router";
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
import { AppLayoutCartoDialog } from "@/components/AppLayout/Carto";
import BackToMap from "@/components/Map/BackToMap";
import { BaseLayer, useMapContext } from "@/components/Map/Provider";

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

export interface MapLayer {
  name: string;
  value: boolean;
}

export interface MapLayers {
  [key: string]: MapLayer;
}

export interface MapPanelLayersProps {}

const MapPanelLayers: FC<MapPanelLayersProps> = ({}) => {
  const { activeLayers, setActiveLayers, setBaseLayer, baseLayer } =
    useMapContext();
  const [active, setActive] = useState<boolean>(false);
  const { t } = useTranslation();
  const router = useRouter();
  const labels = t("components.Map.Layers.defaultLayers", {
    returnObjects: true,
  });

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = (event.target as HTMLInputElement).value;

    setBaseLayer(value as BaseLayer);
  };

  const handleLayerChange = (key: string, layer: MapLayer) => {
    const newLayers = { ...activeLayers } as MapLayers;

    newLayers[key].value = !layer.value;

    setActiveLayers({
      ...newLayers,
      [key]: newLayers[key],
    });
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
                value={baseLayer}
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
                {t("components.Map.Layers.activeLayers")}
              </FormLabel>
              {Object.keys(activeLayers)
                .sort()
                .map((key: string) => {
                  return (
                    <FormControlLabel
                      key={key}
                      label={labels[key]}
                      control={
                        <Checkbox
                          color="primary"
                          checked={activeLayers[key].value}
                          onChange={() =>
                            handleLayerChange(key, activeLayers[key])
                          }
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

export default MapPanelLayers;
