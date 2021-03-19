import React from "react";
import { Grid, Typography, Button } from "@material-ui/core";
import CheckCircleIcon from "@material-ui/icons/CheckCircle";
import { useTranslation } from "react-i18next";

import { useRouter } from "next/router";
import { useAppContext } from "@/providers/AppContext";

export interface ETKImportImportedProps {
  onReset?(): void;
}

const defaultProps: ETKImportImportedProps = {
  onReset: () => {},
};

const ETKImportImported: React.FC<ETKImportImportedProps> = (props) => {
  const router = useRouter();
  const { t } = useTranslation("components");
  const { organization } = useAppContext();

  const onHistoryClick = () => {
    router.push({
      pathname: "/[organizationSlug]/imports",
      query: {
        organizationSlug: organization.slug,
      },
    });
  };

  return (
    <Grid container item alignItems="center" direction="column" spacing={2}>
      <Grid item>
        <Typography variant="h6">
          {t("Import.Imported.importedText")}
        </Typography>
      </Grid>
      <Grid item>
        <CheckCircleIcon color="primary" style={{ fontSize: 120 }} />
      </Grid>
      <Grid item>
        <Button color="primary" variant="contained" onClick={props.onReset}>
          {t("Import.Imported.buttonResetText")}
        </Button>
      </Grid>
      <Grid item>
        <Typography>ou</Typography>
      </Grid>
      <Grid item>
        <Button color="primary" variant="contained" onClick={onHistoryClick}>
          {t("Import.Imported.buttonHistoryText")}
        </Button>
      </Grid>
    </Grid>
  );
};

ETKImportImported.defaultProps = defaultProps;

export default ETKImportImported;
