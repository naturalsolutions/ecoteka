import { FC, Fragment, useState, useEffect } from "react";
import { TOrganization } from "@/pages/organization/[id]";
import { useQuery } from "react-query";
import { makeStyles } from "@material-ui/core/styles";
import { apiRest } from "@/lib/api";
import { Box, Button, Toolbar, FormControl, InputLabel, Select, MenuItem } from "@material-ui/core";
import { Delete as DeleteIcon, Archive as ArchiveIcon, Add as AddIcon } from "@material-ui/icons";
import { AgGridColumn, AgGridReact } from "ag-grid-react";

import "ag-grid-community/dist/styles/ag-grid.css";
import "ag-grid-community/dist/styles/ag-theme-alpine.css";

interface MembersProps {
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

const SelectRoleRenderer: FC = (props) => {
  const [role, setRole] = useState("");
  const classes = useStyles();

  const handleChange = (event) => {
    setRole(event.target.value);
  };
  return (
    <FormControl className={classes.formControl}>
      <InputLabel id="demo-simple-select-outlined-label">Rôle</InputLabel>
      <Select labelId="demo-simple-select-outlined-label" id="demo-simple-select-outlined" value={role} onChange={handleChange} label="Age">
        <MenuItem value="">
          <em>Aucun</em>
        </MenuItem>
        <MenuItem value={"admin"}>Administrateur</MenuItem>
        <MenuItem value={"reader"}>Éditeur</MenuItem>
        <MenuItem value={"guest"}>Invité</MenuItem>
      </Select>
    </FormControl>
  );
};

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

const Members: FC<MembersProps> = (props) => {
  const classes = useStyles();
  const { status, data, error, isFetching } = useQuery(
    "members",
    async () => {
      const data = await apiRest.organization.members(props.organization.id);
      return data;
    },
    {
      enabled: Boolean(props.organization),
    }
  );

  const [gridApi, setGridApi] = useState(null);
  const [enableActions, setEnableActions] = useState(true);

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

  function addMember() {
    const member = {
      id: 2,
      email: "new@ecoteka.natural-solutions.eu",
      full_name: "New member",
    };
    const newData = [member, ...data];
    gridApi.setRowData(newData);
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
        <Button variant="contained" size="small" disabled={enableActions} color="secondary" className={classes.button} startIcon={<ArchiveIcon />}>
          Archiver
        </Button>
        <Button variant="contained" size="small" disabled={enableActions} color="secondary" className={classes.button} startIcon={<DeleteIcon />}>
          Supprimer
        </Button>
        <Button variant="contained" size="small" color="primary" className={classes.button} startIcon={<AddIcon />} onClick={addMember}>
          Ajouter un membre
        </Button>
      </Toolbar>
      {data && (
        <div className="ag-theme-alpine" style={{ width: "100%" }}>
          <AgGridReact
            onGridReady={onGridReady}
            rowData={data}
            domLayout="autoHeight"
            rowSelection="multiple"
            suppressRowClickSelection
            onSelectionChanged={onSelectionChanged}
            frameworkComponents={{
              editBtnRenderer: EditBtnRenderer,
              selectRoleRenderer: SelectRoleRenderer,
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
            <AgGridColumn field="role" cellRenderer="selectRoleRenderer" />
            <AgGridColumn field="actions" cellRenderer="editBtnRenderer" />
          </AgGridReact>
        </div>
      )}
    </Fragment>
  );
};

export default Members;
