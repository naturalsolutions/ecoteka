import { FC, Fragment, useEffect, useRef, useState } from "react";
import { TOrganization } from "@/pages/organization/[id]";
import { useQuery, useQueryCache } from "react-query";
import { apiRest } from "@/lib/api";
import { Box, Button, makeStyles, Toolbar } from "@material-ui/core";
import { Delete as DeleteIcon, Archive as ArchiveIcon, Add as AddIcon } from "@material-ui/icons";
import { AgGridColumn, AgGridReact } from "ag-grid-react";

import "ag-grid-community/dist/styles/ag-grid.css";
import "ag-grid-community/dist/styles/ag-theme-material.css";
import CellGridSelectRenderer from "../CellGridSelectRenderer";
import { useTemplate } from "@/components/Template";
import ETKFormTeam, { ETKFormTeamActions } from "./Form";
import { useTranslation } from "react-i18next";

interface TeamsProps {
  organization: TOrganization;
  value: string;
  index: string;
}

function EditBtnRenderer(props) {
  return (
    <Button
      onClick={() => {
        console.log(props);
      }}
    >
      Edit
    </Button>
  );
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
  },
}));

const Teams: FC<TeamsProps> = (props) => {
  const classes = useStyles();
  const { dialog, theme } = useTemplate();
  const formRef = useRef<ETKFormTeamActions>();
  const { t } = useTranslation(["components", "common"]);

  const cache = useQueryCache();
  const { status, data, error, isFetching } = useQuery(
    "teams",
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

  function test() {
    data[2].name = "toto";
    gridApi.setRowData(data);
  }

  function groupAction() {
    console.log(gridApi.getSelectedNodes());
  }

  function openForm(organization?) {
    const isNew = !Boolean(organization);
    const dialogActions = [
      {
        label: t("components:Team.buttonCancelContent"),
      },
      {
        label: t("components:Team.buttonSubmitContent"),
        variant: "contained",
        color: "secondary",
        noClose: true,
        onClick: addItem,
      },
    ];

    dialog.current.open({
      title: t(`components:Team.dialogTitle${isNew ? "Create" : "Edit"}`),
      content: (
        <ETKFormTeam
          ref={formRef}
          organization={
            organization || {
              parent_id: props.organization.id,
            }
          }
        />
      ),
      actions: dialogActions,
    });
  }

  const addItem = async () => {
    const isOk = await formRef.current.submit();
    if (isOk) {
      dialog.current.close();
      //TODO Add a row to the array instead of reload the complete collection
      cache.invalidateQueries("teams");
    }
  };

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
        <Button
          variant="contained"
          size="small"
          color="primary"
          className={classes.button}
          startIcon={<AddIcon />}
          onClick={() => {
            openForm();
          }}
        >
          Ajouter une équipe
        </Button>
      </Toolbar>
      <div className="ag-theme-material" style={{ width: "100%" }}>
        <AgGridReact
          onGridReady={onGridReady}
          domLayout="autoHeight"
          rowSelection="multiple"
          suppressRowClickSelection
          frameworkComponents={{
            editBtnRenderer: (params) => {
              return (
                <Button
                  onClick={() => {
                    openForm(params.data);
                  }}
                >
                  Edit
                </Button>
              );
            },
            selectRenderer: CellGridSelectRenderer,
          }}
        >
          <AgGridColumn
            field="id"
            resizable
            sortable
            filter
            width={100}
            suppressSizeToFit={true}
            headerCheckboxSelection={true}
            checkboxSelection={true}
          ></AgGridColumn>
          <AgGridColumn field="name" resizable sortable filter></AgGridColumn>
          <AgGridColumn field="slug" resizable sortable filter></AgGridColumn>
          <AgGridColumn field="path" resizable sortable filter></AgGridColumn>
          <AgGridColumn cellRenderer="editBtnRenderer" />
        </AgGridReact>
      </div>
    </Fragment>
  );
};

export default Teams;
