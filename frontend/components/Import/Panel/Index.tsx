import React, { useState, useEffect } from "react";
import { Box, Grid, Button } from "@material-ui/core";
import ETKGeofile from "@/components/Geofile";
import ETKImportTemplate from "@/components/Import/Panel/Template";
import ETKMissingData from "@/components/Import/Panel/MissingDatas";
import ETKMapping from "@/components/Import/Panel/Mapping";
import ETKImported from "@/components/Import/Panel/Imported";
import ETKUpload from "@/components/Import/Panel/Upload";
import ETKError from "@/components/Import/Panel/Error";
import ETKImportImporting from "@/components/Import/Panel/Importing";
import { useTranslation } from "react-i18next";
import { useAppContext } from "@/providers/AppContext";
import { useRouter } from "next/router";
import useApi from "@/lib/useApi";

export interface Choice {
  value?: string;
  label?: string;
}

interface IImportPanel {
  onFileImported?(coordinates: [number, number]): void;
}

const ETKImport: React.FC<IImportPanel> = ({ onFileImported }) => {
  const [step, setStep] = useState("start");
  const { t } = useTranslation("components");
  const [geofile, setGeofile] = useState<ETKGeofile>();
  const [missingInfo, setMissingInfo] = useState<[string?]>([]);
  const { user } = useAppContext();
  const router = useRouter();
  const { apiETK } = useApi().api;

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

    try {
      const {
        data: { longitude, latitude },
      } = await apiETK.get(
        `/organization/${geofile.organization_id}/get-centroid-organization`
      );

      onFileImported([longitude, latitude]);
    } catch (error) {}
  };

  const onReset = () => {
    setGeofile(null);
    setMissingInfo([]);
    setStep("start");
  };

  const importGeofile = async () => {
    try {
      await apiETK.post(
        `/organization/${user.currentOrganization.id}/trees/import?name=${geofile.name}`
      );
    } catch (error) {}
    setStep("importing");
  };

  useEffect(() => {
    if (step === "uploaded") {
      importGeofile();
    }
  }, [step]);

  return (
    <Grid container direction="column" justify="center">
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
          <Box mt={3}>
            <Button
              variant="outlined"
              fullWidth
              onClick={() => {
                router.push("/imports/");
              }}
            >
              {t("components.Import.Upload.importHistory")}
            </Button>
          </Box>
          <Box mt={5}>
            <ETKImportTemplate />
          </Box>
        </Grid>
      )}
    </Grid>
  );
};

export default ETKImport;
