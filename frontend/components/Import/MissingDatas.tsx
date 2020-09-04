import React, { useState, useEffect } from "react";
import { Button, Typography, Grid, Box, Select } from "@material-ui/core";
import TextField from "@material-ui/core/TextField";
import { makeStyles, createStyles } from "@material-ui/core/styles";
import MenuItem from "@material-ui/core/MenuItem";
import getConfig from "next/config";
import ETKGeofile from "../Geofile";

const { publicRuntimeConfig } = getConfig();

export interface ETKMissingDatasProps {
  geoFile?: ETKGeofile;
  missingInfo?: [string?];
  titleText: string;
  hintText: string;
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
  })
);

const ETKMissingDatas: React.FC<ETKMissingDatasProps> = (props) => {
  const classes = useStyle();
  const [isReady, setIsReady] = useState(false);

  const crsColumnChoices = [
    { value: "1", label: "1" },
    { value: "2", label: "2" },
    { value: "3", label: "3" },
  ];

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

    const url = `${publicRuntimeConfig.apiUrl}/geo_files`;
    const requestOptions = {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newGeofile),
    };

    try {
      const response = await fetch(`${url}`, requestOptions);
      const data = await response.json();

      if (200 <= response.status && response.status < 400) {
        props.onUpdateGeofile(data);
      }
    } catch (error) {}
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
                <Typography component="h2">{props.titleText}</Typography>
              </Grid>
              <Grid item className={classes.white}>
                <p>{props.hintText}</p>
              </Grid>
              {props.missingInfo.includes("latitude_column") && (
                <Grid item style={{ marginBottom: ".7rem" }}>
                  <TextField
                    select
                    name="latitude_column"
                    label="Latitude"
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
                    label="Longitude"
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
                    label="Système de Référence de Coordonnées"
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
        <Grid item>
          <Button
            variant="contained"
            color="primary"
            disabled={!isReady}
            onClick={onUpdate}
          >
            Submit
          </Button>
        </Grid>
      </Grid>
    );
  }
};

ETKMissingDatas.defaultProps = {
  geoFile: undefined,
  missingInfo: [],
  titleText: "The file you upload missing some informations",
  hintText:
    "Please define the fields corresponding to the columns of your file",
  onUpdateGeofile() {},
};

export default ETKMissingDatas;
