import React, { useState, useEffect } from "react";
import { makeStyles, createStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import getConfig from "next/config";
import ETKGeofile from "../Geofile";
import ETKImportTemplate from "./Template";
import ETKMissingData from "./MissingDatas";
import ETKButtonImport from "./ButtonImport";
import ETKUpload from "./Upload";

export interface ETKImportProps {
  width?: Number;
  isOpen: File;
  tooltipcontent: [string];
  extensionsFileAccepted: [string];
  templateTips: string;
  dropzoneText: string;
}

export interface Choice {
  value?: string;
  label?: string;
}

const useStyles = makeStyles((theme) =>
  createStyles({
    root: {
      padding: "1rem",
      boxSizing: "border-box",
    },
    import: {
      alignSelf: "flex-start",
    },
  })
);

const ETKImport: React.FC<ETKImportProps> = (props) => {
  const classes = useStyles();
  const [templateIsOpen, setTemplateIsOpen] = useState(true);
  const [geofile, setGeofile] = useState<ETKGeofile>();
  const [isUploaded, setIsUploaded] = useState(false);
  const [isReadyToImport, setIsReadyToImport] = useState(false);
  const [missingInfo, setMissingInfo] = useState<[string?]>([]);
  const [progressBarMessage, setProgressBarMessage] = useState("");

  const checkMissingInfo = (geofileToCheck: ETKGeofile): [string?] => {
    const driversToCheck = ["CSV", "Excel"];
    const keysToCheck = ["crs", "latitude_column", "longitude_column"];
    const keysMissing = [] as [string?];

    if (
      geofileToCheck.driver &&
      driversToCheck.includes(geofileToCheck.driver)
    ) {
      for (let i = 0; i < keysToCheck.length; i++) {
        if (!geofileToCheck[keysToCheck[i]]) {
          keysMissing.push(keysToCheck[i]);
        }
      }
    }

    return keysMissing;
  };

  const onUploaded = (newGeofile) => {
    setGeofile(newGeofile);
    const missing = checkMissingInfo(newGeofile);

    if (missing.length) {
      setMissingInfo(missing);
      setIsReadyToImport(false);
      return;
    }

    setIsUploaded(true);
    setIsReadyToImport(true);
  };

  const onUpdateGeofile = (newGeofile) => {
    setGeofile(newGeofile);
    setMissingInfo([]);
    setIsUploaded(true);
    setIsReadyToImport(true);
  };

  const onImported = () => {
    setGeofile(null);
    setMissingInfo([]);
    setIsUploaded(false);
    setIsReadyToImport(false);
  };

  return (
    <Grid
      container
      direction="column"
      justify="center"
      className={classes.root}
      style={{ width: `${props.width}px`, height: "100%" }}
    >
      <Grid item>
        <ETKUpload
          geofile={geofile}
          tooltipcontent={props.tooltipcontent}
          extensionsFileAccepted={props.extensionsFileAccepted}
          dropzoneText={props.dropzoneText}
          progressBarMessage={progressBarMessage}
          missingInfo={missingInfo}
          isUploaded={isUploaded}
          isReadyToImport={isReadyToImport}
          onUploaded={onUploaded}
        />
      </Grid>

      <Grid item style={{ width: "100%" }}>
        <ETKMissingData
          geoFile={geofile}
          missingInfo={missingInfo}
          onUpdateGeofile={onUpdateGeofile}
          titleText="Le fichier que vous téléchargez manque d'informations"
          hintText="Veuillez définir les champs correspondant aux colonnes de votre fichier"
        />
      </Grid>

      {isReadyToImport ? (
        <Grid container justify="flex-end">
          <ETKButtonImport name={geofile?.name} onImported={onImported} />
        </Grid>
      ) : null}

      <Grid item style={{ flexGrow: 1 }}>
        <span>&nbsp;</span>
      </Grid>

      <Grid item>
        <ETKImportTemplate isOpen={templateIsOpen} />
      </Grid>
    </Grid>
  );
};

ETKImport.defaultProps = {
  width: 500,
};

export default ETKImport;
