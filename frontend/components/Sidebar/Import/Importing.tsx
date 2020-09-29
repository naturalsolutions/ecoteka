import React, { useState, useEffect } from "react";
import { Grid, Typography, CircularProgress } from "@material-ui/core";
import { ETKGeofile } from "@/ETKC";
import { apiRest } from "@/lib/api";

export interface ETKImportImportingProps {
  geofile: ETKGeofile;
  importingText?: string;
  onImported?(error: boolean): void;
}

const defaultProps: ETKImportImportingProps = {
  geofile: {} as ETKGeofile,
  importingText: "En important...",
  onImported: () => {},
};

const ETKImportImporting: React.FC<ETKImportImportingProps> = (props) => {
  const [isImporting, setIsImporting] = useState(true);

  const check = async () => {
    const response = await apiRest.geofiles.get(props.geofile.name);

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
        <Typography variant="h6">{props.importingText}</Typography>
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
