import { FC, Fragment, useState, useEffect } from "react";
import { TOrganization } from "@/pages/organization/[id]";
import { useQuery } from "react-query";
import { makeStyles } from "@material-ui/core/styles";
import { apiRest } from "@/lib/api";
import { Box, Button, Toolbar, FormControl, InputLabel, Select, MenuItem, useMediaQuery } from "@material-ui/core";
import { Block as BlockIcon, Add as AddIcon } from "@material-ui/icons";
import { AgGridColumn, AgGridReact } from "ag-grid-react";
import { useTemplate } from "@/components/Template";
import { useTranslation } from "react-i18next";
import { CellGridSelectRenderer } from "@/components/Organization";
import { AddMembers } from "@/components/Organization/Members";

import "ag-grid-community/dist/styles/ag-grid.css";
import "ag-grid-community/dist/styles/ag-theme-material.css";

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
interface MembersProps {
  organization: TOrganization;
  value: string;
  index: string;
}

const Members: FC<MembersProps> = ({ organization, value, index }) => {
  const classes = useStyles();
  const { dialog, theme } = useTemplate();
  const matches = useMediaQuery(theme.breakpoints.down("md"));
  const { t } = useTranslation(["components", "common"]);
  const { status, data, error, isFetching } = useQuery(
    "members",
    async () => {
      const data = await apiRest.organization.members(organization.id);
      return data;
    },
    {
      enabled: Boolean(organization),
    }
  );

  const [gridApi, setGridApi] = useState(null);
  const [enableActions, setEnableActions] = useState(true);

  const isVisible = value == index;
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

  function onSubmitMembers() {
    alert("new members");
  }

  function addMember() {
    const dialogActions = [
      {
        label: t("components:Organization.Members.buttonCancelContent"),
      },
      {
        label: t("components:Organization.Members.buttonSubmitContent"),
        variant: "contained",
        color: "secondary",
        noClose: true,
        onClick: onSubmitMembers,
      },
    ];

    dialog.current.open({
      title: t("components:Organization.Members.dialogTile"),
      content: <AddMembers organizationID={organization.id} />,
      actions: dialogActions,
      dialogProps: {
        maxWidth: "sm",
        fullWidth: true,
        fullScreen: matches,
        disableBackdropClick: true,
      },
    });
  }

  function onSelectionChanged() {
    // console.log("selectedNodes", gridApi.getSelectedNodes());
    // console.log("selectedRows", gridApi.getSelectedRows());
    const selectedRows = gridApi.getSelectedRows();
    setEnableActions(selectedRows.length > 0 ? false : true);
  }

  function groupAction() {
    console.log(gridApi.getSelectedNodes());
  }

  return (
    <Fragment>
      <Toolbar className={classes.toolbar}>
        <Box className={classes.root} />
        <Button variant="contained" size="small" disabled={enableActions} color="secondary" className={classes.button} startIcon={<BlockIcon />}>
          Retirer du groupe
        </Button>
        <Button variant="contained" size="small" color="primary" className={classes.button} startIcon={<AddIcon />} onClick={addMember}>
          Ajouter des membres
        </Button>
      </Toolbar>
      {data && (
        <div className="ag-theme-material" style={{ width: "100%" }}>
          <AgGridReact
            onGridReady={onGridReady}
            rowData={data}
            domLayout="autoHeight"
            rowSelection="multiple"
            suppressRowClickSelection
            enableCellTextSelection
            onSelectionChanged={onSelectionChanged}
            frameworkComponents={{
              editBtnRenderer: EditBtnRenderer,
              selectRoleRenderer: CellGridSelectRenderer,
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
            <AgGridColumn field="email" resizable sortable filter></AgGridColumn>
            <AgGridColumn field="full_name" resizable sortable filter></AgGridColumn>
            <AgGridColumn
              field="role"
              cellRenderer="selectRoleRenderer"
              cellRendererParams={{
                placeholder: "Définir le rôle...",
                items: [
                  {
                    label: "Propriétaire",
                    value: "owner",
                  },
                  {
                    label: "Manager",
                    value: "manager",
                  },
                  {
                    label: "Contributeur",
                    value: "contributor",
                  },
                  {
                    label: "Lecteur",
                    value: "reader",
                  },
                  {
                    label: "Invité",
                    value: "guest",
                  },
                ],
                onChange: (params, newValue, oldValue) => {
                  console.log(params.data.id, params.data.role);
                },
              }}
            />
          </AgGridReact>
        </div>
      )}
    </Fragment>
  );
};

export default Members;
