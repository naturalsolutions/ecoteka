import React, { useState } from "react";
import { makeStyles, createStyles } from "@material-ui/core/styles";
import { Grid, Typography, Button, Paper, Box } from "@material-ui/core";
import { useTranslation } from "react-i18next";

import ETKImportHistoryTable from "@/components/Import/History/Table";
import ETKImportHistoryEmpty from "@/components/Import/History/Empty";
import { useAppLayout } from "@/components/AppLayout/Base";
import Geofile from "@/components/Geofile";
import router, { useRouter } from "next/router";
import Head from "next/head";
import { useAppContext } from "@/providers/AppContext";

export interface ETKImportHistoryIndexProps {
  rows?: Geofile[];
  onSelected?(selected: string[]): void;
  onDelete?(selected: string[]): void;
}

const defaultProps: ETKImportHistoryIndexProps = {
  rows: [],
  onSelected: (selected: string[]) => {},
  onDelete: (selected: string[]) => {},
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
  const router = useRouter();
  const { organization } = useAppContext();

  const onSelected = (newSelected) => {
    setSelected(newSelected);
    props.onSelected(newSelected);
  };

  const onDeleteClick = () => {
    dialog.current.open({
      title: t("components.ImportHistoryIndex.dialog.title"),
      content: t("components.ImportHistoryIndex.dialog.content"),
      actions: [
        {
          label: t("components.ImportHistoryIndex.dialog.yes"),
          variant: "outlined",
          color: "primary",
          onClick: () => {
            props.onDelete(selected);
          },
        },
        {
          label: t("components.ImportHistoryIndex.dialog.cancel"),
          variant: "contained",
          color: "primary",
        },
      ],
    });
  };

  return (
    <Paper className={classes.paper} square>
      <Head>
        <title>ecoTeka - {t("components.ImportHistoryIndex.title")}</title>
      </Head>
      <Grid
        container
        direction="column"
        justifyContent="flex-start"
        alignItems="stretch"
        className={classes.gridContainer}
      >
        <Grid item>
          <Box px={3} pt={2}>
            <Grid container alignItems="center">
              <Grid item xs={6}>
                <Typography variant="h5">
                  {t("components.ImportHistoryIndex.title")}
                </Typography>
              </Grid>
              {props.rows.length > 0 && (
                <Grid item xs={6}>
                  <Grid container spacing={1} direction="row-reverse">
                    <Grid item>
                      <Button
                        variant="outlined"
                        color="primary"
                        size="large"
                        onClick={() => {
                          router.push({
                            pathname: "/[organizationSlug]/map",
                            query: {
                              organizationSlug: organization.slug,
                            },
                          });
                        }}
                      >
                        {t("components.ImportHistoryIndex.importText")}
                      </Button>
                    </Grid>
                    <Grid item>
                      <Button
                        disabled={!selected.length || !props.rows.length}
                        variant="outlined"
                        color="primary"
                        size="large"
                        onClick={onDeleteClick}
                      >
                        {t("components.ImportHistoryIndex.deleteText")}
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
