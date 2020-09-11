import React from "react";
import { makeStyles, createStyles } from "@material-ui/core/styles";
import { Grid, Typography, Button, Paper } from "@material-ui/core";

import ETKImportHistoryTable from "./Table";
import Geofile from "../../Geofile";

export interface ETKImportHistoryIndexProps {
  headers: [];
  rows?: Geofile[];
  title: string;
  importText: string;
  deleteText: string;
}

const defaultProps: ETKImportHistoryIndexProps = {
  headers: [],
  rows: [],
  title: "Historique des imports",
  importText: "Importer",
  deleteText: "Supprimer",
};

const useStyles = makeStyles(() =>
  createStyles({
    grid: {
      height: "100%",
      width: "100%",
      padding: "1rem",
    },
    table: {
      marginTop: "1rem",
    },
  })
);

const ETKImportHistoryIndex: React.FC<ETKImportHistoryIndexProps> = (props) => {
  const classes = useStyles();

  return (
    <Grid className={classes.grid}>
      <Grid container alignItems="center">
        <Grid item xs={6}>
          <Typography variant="h5">{props.title}</Typography>
        </Grid>
        <Grid item xs={6}>
          <Grid container spacing={1} direction="row-reverse">
            <Grid item>
              <Button variant="contained" color="primary">
                {props.importText}
              </Button>
            </Grid>
            <Grid item>
              <Button variant="contained" color="primary">
                {props.deleteText}
              </Button>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
      <Paper className={classes.table}>
        <ETKImportHistoryTable rows={props.rows} headers={props.headers} />
      </Paper>
    </Grid>
  );
};

ETKImportHistoryIndex.defaultProps = defaultProps;

export default ETKImportHistoryIndex;
