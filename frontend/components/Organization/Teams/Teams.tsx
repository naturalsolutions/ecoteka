import { FC, Fragment, useEffect, useRef, useState } from "react";
import { TOrganization } from "@/pages/organization/[id]";
import { useQuery, useQueryCache } from "react-query";
import { apiRest } from "@/lib/api"
import { Box, Button, IconButton, makeStyles, Toolbar, Tooltip } from "@material-ui/core";
import { Delete as DeleteIcon, Archive as ArchiveIcon, Add as AddIcon, Edit, PhotoSizeSelectSmall, Visibility } from "@material-ui/icons";
import { AgGridColumn, AgGridReact } from 'ag-grid-react';
import { useRouter } from 'next/router'

import "ag-grid-community/dist/styles/ag-grid.css";
import "ag-grid-community/dist/styles/ag-theme-material.css";
import CellGridSelectRenderer from "@/components/Organization/CellGridSelectRenderer";
import { useTemplate } from "@/components/Template";
import ETKFormOrganization, { ETKFormOrganizationActions } from "@/components/Organization/Form/Form";
import ETKFormWorkingArea, { ETKFormWorkingAreaActions } from "@/components/Organization/WorkingArea/Form";
import { useTranslation } from "react-i18next";

interface TeamsProps {
  organization: TOrganization;
  value: string;
  index: string;
}

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    flexGrow: 1,
  },
  button: {
    margin: theme.spacing(1),
  },
  toolbar: {
    flexDirection: "row",
  },
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120,
  }
}));

const Teams: FC<TeamsProps> = (props) => {
  const classes = useStyles();
  const { dialog, theme } = useTemplate();
  const formEditRef = useRef<ETKFormOrganizationActions>();
  const formAreaRef = useRef<ETKFormWorkingAreaActions>();
  const { t } = useTranslation(["components", "common"]);
  const router = useRouter();

  const cache = useQueryCache();
  const queryName = `teams_${props.organization.id}`
  const { status, data, error, isFetching } = useQuery(
    queryName,
    async () => {
      const data = await apiRest.organization.teams(props.organization.id);
      return data;
    },
    {
      enabled: Boolean(props.organization),
    }
  );

  const [gridApi, setGridApi] = useState(null);
  const [enableActions, setEnableActions] = useState(true);

  useEffect(() => {
    if (gridApi) {
      gridApi.setRowData(data || []);
    }
  }, [gridApi, data]);

  const isVisible = props.value == props.index;
  if (isVisible && gridApi) {
    gridApi.sizeColumnsToFit();
  }

  function onGridReady(params) {
    setGridApi(params.api);
  }

  function openForm(organization?) {
    const isNew = !Boolean(organization);
    const dialogActions = [
      {
        label: t("common:buttons.cancel"),
      },
      {
        label: t("common:buttons.send"),
        variant: "contained",
        color: "secondary",
        noClose: true,
        onClick: addItem,
      },
    ];

    dialog.current.open({
      title: t(`components:Team.dialogTitle${isNew ? 'Create' : 'Edit'}`),
      content: <ETKFormOrganization ref={formEditRef} organization={organization || {
        parent_id: props.organization.id
      }} />,
      actions: dialogActions
    });
  }

  const addItem = async () => {
    const isOk = await formEditRef.current.submit();
    if (isOk) {
      dialog.current.close();
      //TODO Add a row to the array instead of reload the complete collection
      cache.invalidateQueries(queryName);
    }
  };

  function openArea(organization) {
    const dialogActions = [
      {
        label: t("common:buttons.cancel"),
      },
      {
        label: t("common:buttons.send"),
        variant: "contained",
        color: "secondary",
        noClose: true,
        onClick: editWorkingArea,
      },
    ];

    dialog.current.open({
      title: t("components:Organization.WorkingArea.dialogTitle"),
      content: <ETKFormWorkingArea ref={formAreaRef} organization={organization} />,
      actions: dialogActions
    });
  }

  const editWorkingArea = async () => {
    const isOk = await formAreaRef.current.submit();
    if (isOk) {
      dialog.current.close();
      //TODO Add a row to the array instead of reload the complete collection
      cache.invalidateQueries('teams');
    }
  };

  const openTeamPage = (id) => {
    router.push(`/organization/${id}`);
  }

  return (
    <Fragment>
      <Toolbar className={classes.toolbar}>
        <Box className={classes.root} />
        <Button variant="contained" size="small" disabled={enableActions} color="secondary" className={classes.button} startIcon={<ArchiveIcon />}>
          Archiver
        </Button>
        <Button variant="contained" size="small" disabled={enableActions} color="secondary" className={classes.button} startIcon={<DeleteIcon />}>
          Supprimer
        </Button>
        <Button variant="contained" size="small" color="primary" className={classes.button} startIcon={<AddIcon />} onClick={() => { openForm() }}>
          {t("Teams.buttonAdd")}
        </Button>
      </Toolbar>
      <div className="ag-theme-material" style={{ width: '100%' }}>
        <AgGridReact
          onGridReady={onGridReady}
          domLayout="autoHeight"
          rowSelection="multiple"
          suppressRowClickSelection
          enableCellTextSelection
          frameworkComponents={{
            actionsRenderer: (params) => {
              return <Fragment>
                <Tooltip title={t("Teams.tooltipWorkingAreaEdit")}>
                  <IconButton
                    size="small"
                    color="secondary"
                    onClick={() => {
                      openArea(params.data);
                    }}>
                    <PhotoSizeSelectSmall />
                  </IconButton>
                </Tooltip>
                <Tooltip title={t("Teams.tooltipInfoEdit")}>
                  <IconButton
                    size="small"
                    color="secondary"
                    onClick={() => {
                      openForm(params.data);
                    }}>
                    <Edit />
                  </IconButton>
                </Tooltip>
                <Tooltip title={t("Teams.tooltipLink")}>
                  <IconButton
                    size="small"
                    color="secondary"
                    onClick={() => {
                      openTeamPage(params.data.id);
                    }}
                  >
                    <Visibility />
                  </IconButton>
                </Tooltip>
              </Fragment>
            },
            selectRenderer: CellGridSelectRenderer,
          }}
        >
          <AgGridColumn
            field="name"
            resizable
            sortable
            filter
            headerCheckboxSelection={true}
            checkboxSelection={true}
          ></AgGridColumn>
          <AgGridColumn
            cellRenderer="actionsRenderer"
            cellClass="no-focus align-right"
          />
        </AgGridReact>
      </div>
    </Fragment>
  );
};

export default Teams;
