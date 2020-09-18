import React from "react";
import { Grid, Typography, Button } from "@material-ui/core";
import CheckCircleIcon from "@material-ui/icons/CheckCircle";
import { useRouter } from "next/router";

export interface ETKImportImportedProps {
  importedText?: string;
  buttonHistoryText?: string;
  buttonResetText?: string;
  onReset?(): void;
}

const defaultProps: ETKImportImportedProps = {
  importedText: "Votre fichier a été bien importé",
  buttonHistoryText: "Historique des imports",
  buttonResetText: "Importer un autre fichier",
  onReset: () => {},
};

const ETKImportImported: React.FC<ETKImportImportedProps> = (props) => {
  const router = useRouter();

  const onHistoryClick = () => {
    router.push("/imports");
  };

  return (
    <Grid container item alignItems="center" direction="column" spacing={2}>
      <Grid item>
        <Typography variant="h6">{props.importedText}</Typography>
      </Grid>
      <Grid item>
        <CheckCircleIcon color="primary" style={{ fontSize: 120 }} />
      </Grid>
      <Grid item>
        <Button color="primary" variant="contained" onClick={props.onReset}>
          {props.buttonResetText}
        </Button>
      </Grid>
      <Grid item>
        <Typography>ou</Typography>
      </Grid>
      <Grid item>
        <Button color="primary" variant="contained" onClick={onHistoryClick}>
          {props.buttonHistoryText}
        </Button>
      </Grid>
    </Grid>
  );
};

ETKImportImported.defaultProps = defaultProps;

export default ETKImportImported;
