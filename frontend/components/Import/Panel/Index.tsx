import React, { useState, useEffect } from "react";
import { makeStyles, createStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import ETKGeofile from "../../Geofile";
import ETKImportTemplate from "./Template";
import ETKMissingData from "./MissingDatas";
import ETKMapping from "./Mapping";
import ETKImported from "./Imported";
import ETKUpload from "./Upload";
import ETKError from "./Error";
import ETKImportImporting from "./Importing";
import { apiRest } from "../../../lib/api";
import { ETKPanelProps } from "../../Panel";

export interface Choice {
  value?: string;
  label?: string;
}

const useStyles = makeStyles((theme) =>
  createStyles({
    root: {
      maxWidth: "25rem",
    },
    import: {
      alignSelf: "flex-start",
    },
  })
);

const ETKImport: React.FC<ETKPanelProps> = (props) => {
  const classes = useStyles();
  const [step, setStep] = useState("start");
  const [geofile, setGeofile] = useState<ETKGeofile>();
  const [missingInfo, setMissingInfo] = useState<[string?]>([]);

  const checkMissingInfo = (geofileToCheck: ETKGeofile): [string?] => {
    const driversToCheck = ["CSV", "Excel"];
    const keysToCheck = ["latitude_column", "longitude_column"];
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

    setStep("mapping");
  };

  const onUpdateGeofile = (newGeofile) => {
    setMissingInfo([]);
    setGeofile(newGeofile);
    setStep("mapping");
  };

  const onMapping = (newGeofile) => {
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

    props.context?.map?.current?.map?.setStyle(
      `/api/v1/maps/style?token=${apiRest.getToken()}`
    );

    props.context?.map?.current?.map?.on("styledata", () => {
      props.context?.map?.current?.map?.setZoom(12);
      props.context?.map?.current?.map?.flyTo({
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
    >
      {step === "start" && (
        <Grid item>
          <ETKUpload
            geofile={geofile}
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
          />
        </Grid>
      )}

      {step === "mapping" && (
        <ETKMapping geofile={geofile} onCancel={onReset} onSend={onMapping} />
      )}

      {step === "importing" && (
        <ETKImportImporting geofile={geofile} onImported={onImported} />
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

export default ETKImport;
