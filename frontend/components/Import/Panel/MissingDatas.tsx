import React from "react";
import { Button, Typography, Grid } from "@material-ui/core";
import { useTranslation } from "react-i18next";
import * as yup from "yup";

import useETKForm from "@/components/Form/useForm";
import ETKGeofile from "@/components/Geofile";
import { apiRest } from "@/lib/api";
import { useAppContext } from "@/providers/AppContext";

export interface ETKMissingDatasProps {
  geoFile?: ETKGeofile;
  missingInfo?: [string?];
  onCancel?(): void;
  onUpdateGeofile(geofile: ETKGeofile): void;
}

const defaultProps: ETKMissingDatasProps = {
  geoFile: undefined,
  missingInfo: [],
  onUpdateGeofile() {},
};

const ETKMissingDatas: React.FC<ETKMissingDatasProps> = (props) => {
  const { t } = useTranslation("components");
  const { user } = useAppContext();
  const crsColumnChoices = [
    { value: "epsg:4326", label: "EPSG:4326" },
    { value: "epsg:3949", label: "Lambert 9" },
    { value: "epsg:2154", label: "Lambert 93" },
  ];
  let latLonChoice = [];
  let properties = [];

  if (props.geoFile) {
    properties = JSON.parse(props.geoFile?.properties);
    const keys = ["", ...Object.keys(properties)];

    latLonChoice = keys.map((option) => {
      return { label: option, value: option };
    });
  }

  const schema = (missingInfo) => {
    const data = {};

    if (missingInfo.includes("latitude_column")) {
      data["latitude_column"] = {
        type: "select",
        component: {
          label: t("Import.MissingData.labelColumn.lat"),
          defaultValue: latLonChoice[0]?.value,
          items: latLonChoice,
        },
        schema: yup.string().required(t("common:errors.required")),
      };
    }

    if (missingInfo.includes("longitude_column")) {
      data["longitude_column"] = {
        type: "select",
        component: {
          label: t("Import.MissingData.labelColumn.lng"),
          defaultValue: latLonChoice[0]?.value,
          items: latLonChoice,
        },
        schema: yup.string().required(t("common:errors.required")),
      };
    }

    if (missingInfo.includes("crs")) {
      data["crs"] = {
        type: "select",
        component: {
          select: true,
          defaultValue: crsColumnChoices[0].value,
          items: crsColumnChoices,
          label: t("Import.MissingData.labelColumn.crs"),
        },
        schema: yup.string().required(t("common:errors.required")),
      };
    }

    return data;
  };

  const { fields, handleSubmit } = useETKForm({
    schema: schema(props.missingInfo),
  });

  const onUpdate = async (data) => {
    const newGeofile = { ...props.geoFile } as ETKGeofile;

    for (const key in data) {
      newGeofile[key] = data[key];
    }

    const response = await apiRest.geofiles.update(
      user.currentOrganization.id,
      newGeofile
    );
    props.onUpdateGeofile(response);
  };

  if (!props.missingInfo.length) {
    return null;
  } else {
    return (
      <Grid container direction="column" spacing={1}>
        <Grid item>
          <Grid container direction="column">
            <Grid item>
              <Typography component="h2">
                {t("Import.MissingData.titleText")}
              </Typography>
            </Grid>
            <Grid item>
              <p>{t("Import.MissingData.hintText")}</p>
            </Grid>
            <Grid item>{fields.latitude_column}</Grid>
            <Grid item>{fields.longitude_column}</Grid>
            <Grid item>{fields.crs}</Grid>
          </Grid>
        </Grid>
        <Grid item>
          <Grid container justify="space-between">
            <Button variant="contained" onClick={props.onCancel}>
              {t("Import.MissingData.buttonCancelText")}
            </Button>
            <Button
              variant="contained"
              color="primary"
              onClick={handleSubmit(onUpdate)}
            >
              {t("Import.MissingData.buttonSubmitContent")}
            </Button>
          </Grid>
        </Grid>
      </Grid>
    );
  }
};

ETKMissingDatas.defaultProps = defaultProps;

export default ETKMissingDatas;
