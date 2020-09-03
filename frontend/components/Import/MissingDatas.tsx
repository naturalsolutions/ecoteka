import React, { useState } from "react";
import { Button, Typography, Grid, Box, Select } from '@material-ui/core';
import TextField from '@material-ui/core/TextField';
import { makeStyles, createStyles } from "@material-ui/core/styles";
import MenuItem from '@material-ui/core/MenuItem';
import getConfig from "next/config";
import ETKGeofile from '../Geofile'
import {Choice} from './Index'

const { publicRuntimeConfig } = getConfig();


export interface ETKMissingDatasProps {
  geoFile?: ETKGeofile;
  missingInfos?: [string?];
  step?: string;
  latitudeLongitudeChoices: [Choice?];
  crsColumnChoices: [Choice?];
  onUpdateGeofile(geofile: ETKGeofile): void;
  onIsValid(valid: boolean): void;
  titleText: string;
  hintText: string;
}

const useStyle = makeStyles((theme) =>
  createStyles({
    root:{
      height:'100%',
    },
    form: {
      backgroundColor: "#bbb",
      borderRadius: "5px",
      boxSizing: 'border-box',
      width: '100%',
      padding: '1rem',
      '& .MuiInputBase-input': {
        backgroundColor: theme.palette.background.paper
      }
    },
    white: {
      color: "#fff",
    }
  })
);

const ETKMissingDatas: React.FC<ETKMissingDatasProps> = (props) => {
  const classes = useStyle();
  const uploadStarted = ['IMPORT_START', 'IMPORT_COMPLETE'].includes(props.step);

  const [missingInfosDatas, setMissingInfosDatas] = useState({} as any)

  const handleMissingInfosDatas = (event) => {
    console.log("avant",missingInfosDatas)
    missingInfosDatas[event.target.name] = missingInfosDatas[event.target.name] || {};
    missingInfosDatas[event.target.name].value = event.target.value;
    setMissingInfosDatas({ ...missingInfosDatas });
    console.log("aprés",missingInfosDatas)
  }

  const handleMissingInfos = async () => {
    const newGeofile = {...props.geoFile} as ETKGeofile

    if (!props.missingInfos.length) {
      return true;
    }
    console.log("oopps", missingInfosDatas)
    for (const key of props.missingInfos) {
      missingInfosDatas[key] = {
                                ...{ value: undefined , errorMessage: ''},
                                ...missingInfosDatas[key],
                              };

      if (!missingInfosDatas[key].value) {
        missingInfosDatas[key].errorMessage = `Please select your ${key} latitude column`;
      }
    }
    console.log("miss", missingInfosDatas)

    setMissingInfosDatas({ ...missingInfosDatas })

    for (const key in missingInfosDatas) {
      if (missingInfosDatas[key].errorMessage) {
        return false
      }
    }

    for (const key in missingInfosDatas) {
      newGeofile[key] = missingInfosDatas[key].value
    }

    const url = `${publicRuntimeConfig.apiUrl}/geo_files`;
    const requestOptions = {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newGeofile)
    };

    try {
      const response = await fetch(`${url}/${newGeofile.id}`, requestOptions)
      const data = await response.json()
      // TODO : dunno if it's the good way
      // the idea is  to
      // make the request
      // and use callback
      // we handle
      if ( 200 <= response.status && response.status < 400)  {
        props.onUpdateGeofile(data)
        return true
      }
      else {
        props.onUpdateGeofile(data)
        // return Promise.reject(data)
      }
    }
    catch (error) {
      return Promise.reject(error)
    }
  }

  const latLonChoice = (
      props.latitudeLongitudeChoices.map((option) => (
        <MenuItem key={option.value} value={option.value}>
          {option.label}
        </MenuItem>
      ))
    )

  const crsChoice = (
      props.crsColumnChoices.map((option) => (
        <MenuItem key={option.value} value={option.value}>
          {option.label}
        </MenuItem>
      ))
    )

  if (!props.missingInfos.length) {
    return (
      null
    )
  }
  else {
    return (
      <Grid
        container
        // justify="center"
        justify="flex-end"
        spacing={1}
        className={classes.root}
        >
          <Grid item className={classes.form} style={{padding: '.7rem'}}>
            <form noValidate autoComplete="off">
              <Box style={{ backgroundColor: '#bbb' }}>
              <Grid item className={classes.white}>
                <Typography component="h2">
                  {props.titleText}
                </Typography>
              </Grid>
              <Grid item className={classes.white} >
                <p>
                  {props.hintText}
                </p>
              </Grid>
              {
                props.missingInfos.includes('latitude_column')
                &&
                <Grid item style={{marginBottom: '.7rem'}}>
                  <TextField
                    select
                    name="latitude_column"
                    label="Latitude"
                    value={missingInfosDatas.latitude_column?.value || ''}
                    onChange={handleMissingInfosDatas}
                    error={Boolean(missingInfosDatas.latitude_column?.errorMessage)}
                    helperText={missingInfosDatas.latitude_column?.errorMessage }
                    variant="outlined"
                    fullWidth
                  >
                    {latLonChoice}
                  </TextField>
                </Grid>
              }
              {
                props.missingInfos.includes('longitude_column')
                &&
                <Grid item>
                  <TextField
                    select
                    name="longitude_column"
                    label="Longitude"
                    value={missingInfosDatas.longitude_column?.value || ''}
                    onChange={handleMissingInfosDatas}
                    error={Boolean(missingInfosDatas.longitude_column?.errorMessage)}
                    helperText={missingInfosDatas.longitude_column?.errorMessage}
                    variant="outlined"
                    fullWidth
                  >
                    {latLonChoice}
                  </TextField>
                </Grid>
              }
              {
                props.missingInfos.includes('crs')
                &&
                <Grid item style={{marginBottom: '.7rem'}}>
                  <TextField
                    select
                    name="crs_column"
                    label="Système de Référence de Coordonnées"
                    value={missingInfosDatas.crs_column?.value || ''}
                    onChange={handleMissingInfosDatas}
                    error={Boolean(missingInfosDatas.crs_column?.errorMessage)}
                    helperText={missingInfosDatas.crs_column?.errorMessage}
                    variant="outlined"
                    fullWidth
                  >
                    {crsChoice}
                  </TextField>
                </Grid>
              }
              </Box>
            </form>
          </Grid>
          <Grid item>
            <Button variant="contained" color="primary" onClick={handleMissingInfos}>
              Submit
            </Button>
          </Grid>
      </Grid>
    )
  }
};

ETKMissingDatas.defaultProps = {
  geoFile: undefined,
  missingInfos: [],
  step: '',
  latitudeLongitudeChoices: [],
  crsColumnChoices: [],
  onUpdateGeofile() {},
  onIsValid() {},
  titleText: 'The file you upload missing some informations',
  hintText: 'Please define the fields corresponding to the columns of your file'
}

export default ETKMissingDatas;