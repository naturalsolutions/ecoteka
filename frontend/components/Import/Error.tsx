import React from "react";
import { Grid, Typography, Button } from "@material-ui/core";
import ErrorIcon from "@material-ui/icons/Error";
import { useTranslation } from "react-i18next";

import { useRouter } from "next/router";

export interface ETKImportErrorProps {
  onReset?(): void;
}

const defaultProps: ETKImportErrorProps = {
  onReset: () => {},
};

const ETKImportError: React.FC<ETKImportErrorProps> = (props) => {
  const router = useRouter();
  const { t } = useTranslation("components");

  const onHistoryClick = () => {
    router.push("/imports");
  };

  return (
    <Grid container item alignItems="center" direction="column" spacing={2}>
      <Grid item>
        <Typography variant="h6" color="error">
          {t("Import.Error.importedText")}
        </Typography>
      </Grid>
      <Grid item>
        <ErrorIcon color="error" style={{ fontSize: 120 }} />
      </Grid>
      <Grid item>
        <Button color="primary" variant="contained" onClick={props.onReset}>
          {t("buttonResetText")}
        </Button>
      </Grid>
      <Grid item>
        <Typography>ou</Typography>
      </Grid>
      <Grid item>
        <Button color="primary" variant="contained" onClick={onHistoryClick}>
          {t("buttonHistoryText")}
        </Button>
      </Grid>
    </Grid>
  );
};

ETKImportError.defaultProps = defaultProps;

export default ETKImportError;
