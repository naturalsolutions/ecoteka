import React, { useState } from "react";
import { Button, Typography, Grid } from '@material-ui/core';
import { makeStyles, createStyles } from "@material-ui/core/styles";
import getConfig from "next/config";

const { publicRuntimeConfig } = getConfig();

export interface ETKButtonImportProps {
  name: string;
  hidden: boolean;
  onUpdateStepValue(newStepValue:string): void;
}

const ETKButtonImport: React.FC<ETKButtonImportProps> = (props) => {

  console.log("prop btn import",props)

  const hideButton = {
    display:  `${ props.hidden ? 'none' : 'flex'}`
  }
  const handleSubmit = async () => {

    
    const urlStartImport = `${publicRuntimeConfig.apiUrl}/trees/import-from-geofile`;
    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    };

    // TODO: ERROR
    const response = await fetch(`${urlStartImport}?name=${props.name}`, requestOptions)
    const data = await response.json()


    const urlGetStatusGeoFile = `${publicRuntimeConfig.apiUrl}/geo_files/${props.name}`;

    const check = async () => {
      const response = await fetch(urlGetStatusGeoFile);
      const data = await response.json();

      if (data.status === 'importing') {
        setTimeout(() => {
          check();
        }, 5000)
      }
      if (data.status == 'imported') {
        props.onUpdateStepValue('IMPORT_COMPLETE')
      }
    }

    await check()

    props.onUpdateStepValue('IMPORT_PENDING')

  }

  return (
    <Button
      variant="contained"
      color="primary"
      style={hideButton}
      onClick={handleSubmit}>
        IMPORTER
    </Button>
  )
};

ETKButtonImport.defaultProps = {}

export default ETKButtonImport;