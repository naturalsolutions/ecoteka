import React, { useState, useEffect } from "react";
import { Grid, Typography, CircularProgress } from "@material-ui/core";
import { useTranslation } from "react-i18next";

import Geofile from "@/components/Geofile";
import { apiRest } from "@/lib/api";
import { useAppContext } from "@/providers/AppContext";

export interface ETKImportImportingProps {
  geofile: Geofile;
  onImported?(error: boolean): void;
}

const defaultProps: ETKImportImportingProps = {
  geofile: {} as Geofile,
  onImported: () => {},
};

const ETKImportImporting: React.FC<ETKImportImportingProps> = (props) => {
  const [isImporting, setIsImporting] = useState(true);
  const { t } = useTranslation("components");
  const { user } = useAppContext();

  const check = async () => {
    const response = await apiRest.geofiles.get(
      user.currentOrganization.id,
      props.geofile.name
    );

    if (response.status === "imported" || !isImporting) {
      setIsImporting(false);
      props.onImported(false);
    }

    if (response.status === "error" || !isImporting) {
      setIsImporting(false);
      props.onImported(true);
    }
  };

  useEffect(() => {
    const id = setInterval(check, 5000);

    return () => {
      clearInterval(id);
    };
  });

  return (
    <Grid container direction="column" alignItems="stretch" spacing={3}>
      <Grid item>
        <Typography variant="h6">
          {`${t("Import.Importing.importingText")} ${
            props.geofile.original_name
          }...`}
        </Typography>
      </Grid>
      <Grid item>
        <Grid container justify="center">
          <CircularProgress size={80} />
        </Grid>
      </Grid>
    </Grid>
  );
};

ETKImportImporting.defaultProps = defaultProps;

export default ETKImportImporting;
