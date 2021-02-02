import React, { useState, useEffect } from "react";
import { Grid, Typography, CircularProgress } from "@material-ui/core";
import { useTranslation } from "react-i18next";

import Geofile from "@/components/Geofile";
import useApi from "@/lib/useApi";

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
  const { apiETK } = useApi().api;

  const check = async () => {
    try {
      const { data } = await apiETK.get(
        `/organization/${user.currentOrganization.id}/geo_files/${props.geofile.name}`
      );

      if (data.status === "imported" || !isImporting) {
        setIsImporting(false);
        props.onImported(false);
      }

      if (data.status === "error" || !isImporting) {
        setIsImporting(false);
        props.onImported(true);
      }
    } catch (error) {}
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
          {`${t("components.Import.Importing.importingText")} ${
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
