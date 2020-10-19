import React from "react";
import { Button, Typography, Grid, makeStyles } from "@material-ui/core";
import { Card, CardContent } from "@material-ui/core";
import { useTranslation } from "react-i18next";
import useETKForm from "../../Form/useForm";
import * as yup from "yup";

import ETKGeofile from "../../Geofile";
import { apiRest } from "../../../lib/api";

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

const useStyle = makeStyles({
  card: {
    backgroundColor: "#b2dfdc",
  },
});

const ETKMissingDatas: React.FC<ETKMissingDatasProps> = (props) => {
  const { t } = useTranslation("components");
  const classes = useStyle();
  const crsColumnChoices = [{ value: "epsg:4326", label: "EPSG:4326" }];
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

    const response = await apiRest.geofiles.update(newGeofile);
    props.onUpdateGeofile(response);
  };

  if (!props.missingInfo.length) {
    return null;
  } else {
    return (
      <Grid container direction="column" spacing={1}>
        <Grid item>
          <Card elevation={0} className={classes.card}>
            <CardContent>
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
            </CardContent>
          </Card>
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
