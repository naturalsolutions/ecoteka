import React, { useState, useEffect } from "react";
import { Box, Grid, Button } from "@material-ui/core";
import Geofile from "@/components/Geofile";
import ImportTemplate from "@/components/Import/Panel/Template";
import ImportMissingData from "@/components/Import/Panel/MissingDatas";
import ImportMapping from "@/components/Import/Panel/Mapping";
import ImportImported from "@/components/Import/Panel/Imported";
import ImportUpload from "@/components/Import/Panel/Upload";
import ImportError from "@/components/Import/Panel/Error";
import ImportImporting from "@/components/Import/Panel/Importing";
import { useTranslation } from "react-i18next";
import { useAppContext } from "@/providers/AppContext";
import { useRouter } from "next/router";
import useApi from "@/lib/useApi";
import { AppLayoutCartoDialog } from "@/components/AppLayout/Carto";
import BackToMap from "@/components/Map/BackToMap";

export interface Choice {
  value?: string;
  label?: string;
}

interface ImportPanel {
  onFileImported?(coordinates: [number, number]): void;
}

const Import: React.FC<ImportPanel> = ({ onFileImported }) => {
  const [active, setActive] = useState<boolean>(false);
  const [step, setStep] = useState("start");
  const { t } = useTranslation("components");
  const [geofile, setGeofile] = useState<Geofile>();
  const [missingInfo, setMissingInfo] = useState<[string?]>([]);
  const { organization } = useAppContext();
  const router = useRouter();
  const { apiETK } = useApi().api;

  const checkMissingInfo = (geofileToCheck: Geofile): [string?] => {
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
        `/organization/${organization.id}/trees/import?name=${geofile.name}`
      );
    } catch (error) {}
    setStep("importing");
  };

  useEffect(() => {
    if (step === "uploaded") {
      importGeofile();
    }
  }, [step]);

  useEffect(() => {
    const { query, route } = router;

    if (route === "/[organizationSlug]/map" && query.panel === "import") {
      setActive(true);
    } else {
      setActive(false);
    }
  }, [router.query]);

  return (
    active && (
      <AppLayoutCartoDialog actions={<BackToMap />}>
        <Grid container direction="column" justifyContent="center">
          {step === "start" && (
            <Grid item>
              <ImportUpload
                geofile={geofile}
                missingInfo={missingInfo}
                step={step}
                onUploaded={onUploaded}
              />
            </Grid>
          )}

          {step === "missing-data" && (
            <Grid item style={{ width: "100%" }}>
              <ImportMissingData
                geoFile={geofile}
                missingInfo={missingInfo}
                onUpdateGeofile={onUpdateGeofile}
                onCancel={onReset}
              />
            </Grid>
          )}

          {step === "mapping" && (
            <ImportMapping
              geofile={geofile}
              onCancel={onReset}
              onSend={onMapping}
            />
          )}

          {step === "importing" && (
            <ImportImporting geofile={geofile} onImported={onImported} />
          )}

          {step === "imported" && <ImportImported onReset={onReset} />}

          {step === "error" && <ImportError onReset={onReset} />}

          {step === "start" && (
            <Grid item>
              <Box mt={3}>
                <Button
                  variant="outlined"
                  fullWidth
                  onClick={() => {
                    router.push({
                      pathname: "/[organizationSlug]/imports",
                      query: {
                        organizationSlug: organization.slug,
                      },
                    });
                  }}
                >
                  {t("components.Import.Upload.importHistory")}
                </Button>
              </Box>
              <Box mt={5}>
                <ImportTemplate />
              </Box>
            </Grid>
          )}
        </Grid>
      </AppLayoutCartoDialog>
    )
  );
};

export default Import;
