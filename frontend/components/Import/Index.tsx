import React, { useState, useEffect } from "react";
import { makeStyles, createStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import ETKGeofile from "../Geofile";
import ETKImportTemplate from "./Template";
import ETKMissingData from "./MissingDatas";
import ETKImported from "./Imported";
import ETKUpload from "./Upload";
import ETKError from "./Error";
import ETKImportImporting from "./Importing";
import { apiRest } from "../../lib/api";
import layersStyle from "../../public/assets/layersStyle.json";

export interface ETKImportProps {
  width?: Number;
  isOpen: File;
  tooltipcontent: [string];
  extensionsFileAccepted: [string];
  templateTips: string;
  dropzoneText: string;
  map?: any;
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
  const [step, setStep] = useState("start");
  const [geofile, setGeofile] = useState<ETKGeofile>();
  const [missingInfo, setMissingInfo] = useState<[string?]>([]);

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
      setStep("missing-data");
      setMissingInfo(missing);
      return;
    }

    setStep("uploaded");
  };

  const onUpdateGeofile = (newGeofile) => {
    setMissingInfo([]);
    setGeofile(newGeofile);
    setStep("uploaded");
  };

  const onImported = async (error) => {
    if (error) {
      return setStep("error");
    }

    setStep("imported");

    const coordinates = await apiRest.trees.getCentroidFromOrganization(
      geofile.organization_id
    );

    const { longitude, latitude } = coordinates;

    props.map.current.map.setStyle(
      `/api/v1/maps/style?token=${apiRest.getToken()}`
    );

    props.map.current.map.on("styledata", () => {
      for (let layer of Object.keys(layersStyle)) {
        for (let property of Object.keys(layersStyle[layer]["light"])) {
          props.map.current.map.setPaintProperty(
            layer,
            property,
            layersStyle[layer]["light"][property]
          );
        }
      }
      props.map.current.map.setZoom(12);
      props.map.current.map.flyTo({
        center: [longitude, latitude],
      });
    });
  };

  const onReset = () => {
    setGeofile(null);
    setMissingInfo([]);
    setStep("start");
  };

  const importGeofile = async () => {
    await apiRest.trees.importFromGeofile(geofile.name);
    setStep("importing");
  };

  useEffect(() => {
    if (step === "uploaded") {
      importGeofile();
    }
  }, [step]);

  return (
    <Grid
      container
      direction="column"
      justify="center"
      className={classes.root}
      style={{ width: `${props.width}px`, height: "100%" }}
    >
      {step === "start" && (
        <Grid item>
          <ETKUpload
            geofile={geofile}
            tooltipcontent={props.tooltipcontent}
            extensionsFileAccepted={props.extensionsFileAccepted}
            dropzoneText={props.dropzoneText}
            missingInfo={missingInfo}
            step={step}
            onUploaded={onUploaded}
          />
        </Grid>
      )}

      {step === "missing-data" && (
        <Grid item style={{ width: "100%" }}>
          <ETKMissingData
            geoFile={geofile}
            missingInfo={missingInfo}
            onUpdateGeofile={onUpdateGeofile}
            onCancel={onReset}
            titleText="Le fichier que vous téléchargez manque d'informations"
            hintText="Veuillez définir les champs correspondant aux colonnes de votre fichier"
          />
        </Grid>
      )}

      {step === "importing" && (
        <ETKImportImporting
          geofile={geofile}
          importingText={`Import en cours ${geofile.original_name}...`}
          onImported={onImported}
        />
      )}

      {step === "imported" && <ETKImported onReset={onReset} />}

      {step === "error" && <ETKError onReset={onReset} />}

      <Grid item style={{ flexGrow: 1 }}>
        <span>&nbsp;</span>
      </Grid>

      <Grid item>
        <ETKImportTemplate />
      </Grid>
    </Grid>
  );
};

ETKImport.defaultProps = {
  width: 500,
};

export default ETKImport;
