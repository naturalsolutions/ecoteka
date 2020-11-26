import React, { useState, useEffect } from "react";
import { makeStyles, createStyles, Box, Grid } from "@material-ui/core";
import ETKGeofile from "@/components/Geofile";
import ETKImportTemplate from "@/components/Import/Panel/Template";
import ETKMissingData from "@/components/Import/Panel/MissingDatas";
import ETKMapping from "@/components/Import/Panel/Mapping";
import ETKImported from "@/components/Import/Panel/Imported";
import ETKUpload from "@/components/Import/Panel/Upload";
import ETKError from "@/components/Import/Panel/Error";
import ETKImportImporting from "@/components/Import/Panel/Importing";
import { apiRest } from "@/lib/api";
import { ETKPanelProps } from "@/components/Panel";
import { useAppContext } from "@/providers/AppContext";

export interface Choice {
  value?: string;
  label?: string;
}

const useStyles = makeStyles((theme) =>
  createStyles({
    root: {
      minWidth: "25rem",
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
  const { user } = useAppContext();

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

      keysMissing.push("crs");
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

    const coordinates = await apiRest.organization.getCentroidFromOrganization(
      geofile.organization_id
    );

    const { longitude, latitude } = coordinates;

    props.context?.map?.current?.map?.setStyle(
      `/api/v1/maps/style?token=${apiRest.getToken()}&organization_id=${
        user.currentOrganization.id
      }`
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
    await apiRest.trees.importFromGeofile(
      user.currentOrganization.id,
      geofile.name
    );
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

      {step === "start" && (
        <Grid item>
          <Box mt={5}>
            <ETKImportTemplate />
          </Box>
        </Grid>
      )}
    </Grid>
  );
};

export default ETKImport;
