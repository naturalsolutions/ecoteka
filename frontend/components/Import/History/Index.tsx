import React, { useState } from "react";
import { makeStyles, createStyles } from "@material-ui/core/styles";
import { Grid, Typography, Button, Paper, Box } from "@material-ui/core";
import { useTranslation } from "react-i18next";

import ETKImportHistoryTable from "@/components/Import/History/Table";
import ETKImportHistoryEmpty from "@/components/Import/History/Empty";
import { useAppLayout } from "@/components/AppLayout/Base";
import Geofile from "@/components/Geofile";
import { useAppContext } from "@/providers/AppContext";

export interface ETKImportHistoryIndexProps {
  rows?: Geofile[];
  onSelected?(selected: string[]): void;
  onDelete?(selected: string[]): void;
  onImport?(name: string): void;
}

const defaultProps: ETKImportHistoryIndexProps = {
  rows: [],
  onSelected: (selected: string[]) => {},
  onDelete: (selected: string[]) => {},
  onImport: (name: string) => {},
};

const useStyles = makeStyles(() =>
  createStyles({
    paper: {
      height: "100%",
    },
    gridContainer: {
      width: "100%",
      height: "100%",
    },
  })
);

const ETKImportHistoryIndex: React.FC<ETKImportHistoryIndexProps> = (props) => {
  const classes = useStyles();
  const { t } = useTranslation("components");
  const { dialog } = useAppLayout();
  const [selected, setSelected] = useState([]);
  const { user } = useAppContext();

  const onSelected = (newSelected) => {
    setSelected(newSelected);
    props.onSelected(newSelected);
  };

  const onDeleteClick = () => {
    dialog.current.open({
      title: t("ImportHistoryIndex.dialog.title"),
      content: t("ImportHistoryIndex.dialog.content"),
      actions: [
        {
          label: t("ImportHistoryIndex.dialog.yes"),
          variant: "outlined",
          color: "primary",
          onClick: () => {
            props.onDelete(selected);
          },
        },
        {
          label: t("ImportHistoryIndex.dialog.cancel"),
          variant: "contained",
          color: "primary",
        },
      ],
    });
  };

  return (
    <Paper className={classes.paper} square>
      <Grid
        container
        direction="column"
        justify="flex-start"
        alignItems="stretch"
        className={classes.gridContainer}
      >
        <Grid item>
          <Box px={3} pt={2}>
            <Grid container alignItems="center">
              <Grid item xs={6}>
                <Typography variant="h5">
                  {t("ImportHistoryIndex.title")}
                </Typography>
              </Grid>
              {props.rows.length > 0 && (
                <Grid item xs={6}>
                  <Grid container spacing={1} direction="row-reverse">
                    <Grid item>
                      <Button
                        disabled={!selected.length || !props.rows.length}
                        variant="outlined"
                        color="primary"
                        size="large"
                        onClick={onDeleteClick}
                      >
                        {t("ImportHistoryIndex.deleteText")}
                      </Button>
                    </Grid>
                    <Grid item>
                      <Button
                        disabled={
                          !Boolean(selected.length === 1) || !props.rows.length
                        }
                        variant="contained"
                        color="primary"
                        size="large"
                        onClick={() => props.onImport(selected.pop())}
                      >
                        {t("ImportHistoryIndex.importText")}
                      </Button>
                    </Grid>
                  </Grid>
                </Grid>
              )}
            </Grid>
          </Box>
        </Grid>
        <Grid item xs>
          {props.rows.length > 0 ? (
            <Box p={3}>
              <ETKImportHistoryTable
                rows={props.rows}
                onSelected={onSelected}
              />
            </Box>
          ) : (
            <ETKImportHistoryEmpty />
          )}
        </Grid>
      </Grid>
    </Paper>
  );
};

ETKImportHistoryIndex.defaultProps = defaultProps;

export default ETKImportHistoryIndex;
