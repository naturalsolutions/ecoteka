import React, { useState } from "react";
import { Button, Typography, Grid } from "@material-ui/core";
import { makeStyles, createStyles } from "@material-ui/core/styles";
import getConfig from "next/config";

const { publicRuntimeConfig } = getConfig();

export interface ETKButtonImportProps {
  name: string;
  onImported(): void;
  buttonImportContent?: string;
}

const defaultProps: ETKButtonImportProps = {
  name: "",
  onImported: ()=> {},
  buttonImportContent: "IMPORT",
  //fr buttonImportContent: "IMPORTER"
}

const ETKButtonImport: React.FC<ETKButtonImportProps> = (props) => {
  const onImport = async () => {
    const urlStartImport = `${publicRuntimeConfig.apiUrl}/trees/import-from-geofile`;
    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
    };

    const check = async () => {
      const response = await fetch(
        `${urlStartImport}?name=${props.name}`,
        requestOptions
      );
      const data = await response.json();

      if (data.status === "importing") {
        setTimeout(() => {
          check();
        }, 5000);
      }

      props.onImported();
    };

    await check();
  };

  return (
    <Button variant="contained" color="primary" onClick={onImport}>
      {props.buttonImportContent}
    </Button>
  );
};

ETKButtonImport.defaultProps = defaultProps;

export default ETKButtonImport;
