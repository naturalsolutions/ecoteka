import React, { useEffect, useState } from "react";
import { Button, Typography, Grid, Box } from "@material-ui/core";
import { TextField, MenuItem } from "@material-ui/core";
import { makeStyles, createStyles } from "@material-ui/core/styles";
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

interface DataItem {
  value?: string;
  error?: string;
}

interface Data {
  latitude_column?: DataItem;
  longitude_column?: DataItem;
  crs?: DataItem;
}

const defaultProps: ETKMissingDatasProps = {
  geoFile: undefined,
  missingInfo: [],
  onUpdateGeofile() {},
};

const useStyle = makeStyles((theme) =>
  createStyles({
    root: {
      height: "100%",
    },
    form: {
      backgroundColor: "#bbb",
      borderRadius: "5px",
      boxSizing: "border-box",
      width: "100%",
      padding: "1rem",
      "& .MuiInputBase-input": {
        backgroundColor: theme.palette.background.paper,
      },
    },
    white: {
      color: "#fff",
    },
    toolbar: {
      marginTop: "1rem",
    },
  })
);

const ETKMissingDatas: React.FC<ETKMissingDatasProps> = (props) => {
  const classes = useStyle();
  const { t } = useTranslation("components");
  const [isReady, setIsReady] = useState(false);

  const crsColumnChoices = [{ value: "epsg:4326", label: "EPSG:4326" }];

  const onChangeValue = (e) => {
    data[e.target.name] = {
      value: e.target.value,
      error: null,
    };

    setData({ ...data });

    for (const index of props.missingInfo) {
      if (!data[index] || data[index].error) {
        return setIsReady(false);
      }
    }

    setIsReady(true);
  };

  const onUpdate = async () => {
    const newGeofile = { ...props.geoFile } as ETKGeofile;

    for (const key in data) {
      newGeofile[key] = data[key].value;
    }

    const response = await apiRest.geofiles.update(newGeofile);
    props.onUpdateGeofile(response);
    setData({});
  };

  let latLonChoice = [];

  if (props.geoFile) {
    const properties = JSON.parse(props.geoFile?.properties);
    const keys = Object.keys(properties);

    latLonChoice = keys.map((option) => (
      <MenuItem key={option} value={option}>
        {option}
      </MenuItem>
    ));
  }

  const crsChoice = crsColumnChoices.map((option) => (
    <MenuItem key={option.value} value={option.value}>
      {option.label}
    </MenuItem>
  ));

  const newData = {};

  for (const key of props.missingInfo) {
    newData[key] = { value: undefined, error: "" };

    if (!newData[key].value) {
      newData[key].error = `Please select your ${key} latitude column`;
    }
  }

  const [data, setData] = useState<Data>(newData);

  if (!props.missingInfo.length) {
    return null;
  } else {
    return (
      <Grid container justify="flex-end" spacing={1} className={classes.root}>
        <Grid item className={classes.form} style={{ padding: ".7rem" }}>
          <form noValidate autoComplete="off">
            <Box style={{ backgroundColor: "#bbb" }}>
              <Grid item className={classes.white}>
                <Typography component="h2">
                  {t("Import.MissingData.titleText")}
                </Typography>
              </Grid>
              <Grid item className={classes.white}>
                <p>{t("Import.MissingData.hintText")}</p>
              </Grid>
              {props.missingInfo.includes("latitude_column") && (
                <Grid item style={{ marginBottom: ".7rem" }}>
                  <TextField
                    select
                    name="latitude_column"
                    label={t("Import.MissingData.labelColumn.lat")}
                    value={data.latitude_column?.value || ""}
                    onChange={onChangeValue}
                    error={Boolean(data.latitude_column?.error)}
                    helperText={data.latitude_column?.error}
                    variant="outlined"
                    fullWidth
                  >
                    {latLonChoice}
                  </TextField>
                </Grid>
              )}
              {props.missingInfo.includes("longitude_column") && (
                <Grid item>
                  <TextField
                    select
                    name="longitude_column"
                    label={t("Import.MissingData.labelColumn.lon")}
                    value={data.longitude_column?.value || ""}
                    onChange={onChangeValue}
                    error={Boolean(data.longitude_column?.error)}
                    helperText={data.longitude_column?.error}
                    variant="outlined"
                    fullWidth
                  >
                    {latLonChoice}
                  </TextField>
                </Grid>
              )}
              {props.missingInfo.includes("crs") && (
                <Grid item style={{ margin: ".7rem 0" }}>
                  <TextField
                    select
                    name="crs"
                    label={t("Import.MissingData.labelColumn.crs")}
                    value={data.crs?.value || ""}
                    onChange={onChangeValue}
                    error={Boolean(data.crs?.error)}
                    helperText={data.crs?.error}
                    variant="outlined"
                    fullWidth
                  >
                    {crsChoice}
                  </TextField>
                </Grid>
              )}
            </Box>
          </form>
        </Grid>
        <Grid container justify="space-between" className={classes.toolbar}>
          <Button variant="contained" onClick={props.onCancel}>
            {t("Import.MissingData.buttonCancelText")}
          </Button>
          <Button
            variant="contained"
            color="primary"
            disabled={!isReady}
            onClick={onUpdate}
          >
            {t("Import.MissingData.buttonSubmitContent")}
          </Button>
        </Grid>
      </Grid>
    );
  }
};

ETKMissingDatas.defaultProps = defaultProps;

export default ETKMissingDatas;
