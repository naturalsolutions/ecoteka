import React, { useState } from "react";
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
  onSelected?(selected: string[]): void;
  onDelete?(selected: string[]): void;
  onImport?(name: string): void;
}

const defaultProps: ETKImportHistoryIndexProps = {
  headers: [],
  rows: [],
  title: "Historique des imports",
  importText: "Importer",
  deleteText: "Supprimer",
  onSelected: (selected: string[]) => {},
  onDelete: (selected: string[]) => {},
  onImport: (name: string) => {},
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
  const [selected, setSelected] = useState([]);

  const onSelected = (newSelected) => {
    setSelected(newSelected);
    props.onSelected(newSelected);
  };

  return (
    <Grid className={classes.grid}>
      <Grid container alignItems="center">
        <Grid item xs={6}>
          <Typography variant="h5">{props.title}</Typography>
        </Grid>
        <Grid item xs={6}>
          <Grid container spacing={1} direction="row-reverse">
            <Grid item>
              <Button
                disabled={!Boolean(selected.length === 1)}
                variant="contained"
                color="primary"
                onClick={() => props.onImport(selected.pop())}
              >
                {props.importText}
              </Button>
            </Grid>
            <Grid item>
              <Button
                disabled={!Boolean(selected.length)}
                variant="contained"
                color="primary"
                onClick={() => props.onDelete(selected)}
              >
                {props.deleteText}
              </Button>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
      <Paper className={classes.table}>
        <ETKImportHistoryTable
          rows={props.rows}
          headers={props.headers}
          onSelected={onSelected}
        />
      </Paper>
    </Grid>
  );
};

ETKImportHistoryIndex.defaultProps = defaultProps;

export default ETKImportHistoryIndex;
