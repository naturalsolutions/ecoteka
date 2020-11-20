import { FC, Fragment, useState, useEffect } from "react";
import { IOrganization } from "@/index.d"
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
  return <Button onClick={() => { }}>Edit</Button>;
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
  organization: IOrganization;
  value: string;
  index: string;
}

const Members: FC<MembersProps> = ({ organization, value, index }) => {
  const classes = useStyles();
  const { dialog, theme } = useTemplate();
  const matches = useMediaQuery(theme.breakpoints.down("md"));
  const { t } = useTranslation(["components", "common"]);
  const { status, data, error, isFetching } = useQuery(
    `members_${organization.id}`,
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

  function onDetachMembers() {
    alert("Confirm detachMembers");
  }

  function addMember() {
    const dialogActions = [
      {
        label: t("components:Organization.Members.done"),
      },
    ];

    dialog.current.open({
      title: t("components:Organization.Members.dialogAddMemberTitle"),
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

  function detachMembers() {
    const dialogActions = [
      {
        label: t("components:Organization.Members.cancel"),
      },
      {
        label: t("components:Contact.confirm"),
        variant: "contained",
        color: "error",
        noClose: true,
        onClick: onDetachMembers,
      },
    ];

    dialog.current.open({
      title: t("components:Organization.Members.dialogDdetachMembersTitle"),
      content: <div>Action irréversible!</div>,
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
        <Button
          variant="contained"
          size="small"
          disabled={enableActions}
          color="secondary"
          className={classes.button}
          startIcon={<BlockIcon />}
          onClick={detachMembers}
        >
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
              field="email"
              resizable
              sortable
              filter
              suppressSizeToFit={true}
              headerCheckboxSelection={true}
              checkboxSelection={true}
            ></AgGridColumn>
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
                  console.log("[TODO]: HTTP request to patch member role", params.data.id, params.data.role);
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
