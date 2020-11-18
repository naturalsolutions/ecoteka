import { FC, Fragment, useState, useEffect } from "react";
import { TOrganization } from "@/pages/organization/[id]";
import { useQuery } from "react-query";
import { apiRest } from "@/lib/api"
import { Box, Button, MenuItem, Select, Toolbar } from "@material-ui/core";
import { AgGridColumn, AgGridReact } from 'ag-grid-react';

import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-alpine.css';

interface TeamsProps {
  organization: TOrganization;
  value: string;
  index: string;
}

function EditBtnRenderer(props) {
  return <Button onClick={() => {
    console.log(props);
  }}>Edit</Button>
}

function SelectRenderer(props) {
  const items = props.colDef.cellRendererParams?.items;
  const initValue = items?.find(item => {
    return item.value == props.data.slug;
  })?.value || '';

  const [value, setValue] = useState(initValue);

  function handleChange(e) {
    const newValue = e.target.value;
    setValue(newValue);
    props.setValue(newValue);
  }

  return <Select
    value={value}
    displayEmpty
    onChange={handleChange}
    autoWidth
  >
    <MenuItem value="" disabled>
      {props.colDef.cellRendererParams?.placeholder}
    </MenuItem>
    {items.map((item, i) => {
      return <MenuItem value={item.value} key={i}>{item.label}</MenuItem>
    })}
  </Select>
}

const Teams: FC<TeamsProps> = (props) => {
  const { status, data, error, isFetching } = useQuery("teams", async () => {
    const data = await apiRest.organization.teams(props.organization.id);
    return data;
  }, {
    enabled: Boolean(props.organization)
  });

  const [gridApi, setGridApi] = useState(null);

  const isVisible = props.value == props.index;
  if (isVisible && gridApi) {
    gridApi.sizeColumnsToFit();
  }

  function onGridReady(params) {
    setGridApi(params.api);
  }

  function test() {
    data[2].name = 'toto';
    gridApi.setRowData(data);
  }

  function groupAction() {
    console.log(gridApi.getSelectedNodes());
  }

  return (
    <Fragment>
      <Toolbar>
        <Box display="flex-end" flexDirection="column" flexGrow={1} alignItems="end">
          <Button onClick={groupAction}>Group action</Button>
          <Button onClick={test}>Add</Button>
        </Box>
      </Toolbar>
      {data &&
        <div className="ag-theme-alpine" style={{ width: '100%' }}>
          <AgGridReact
            onGridReady={onGridReady}
            rowData={data}
            domLayout="autoHeight"
            rowSelection="multiple"
            suppressRowClickSelection
            frameworkComponents={{
              editBtnRenderer: EditBtnRenderer,
              selectRenderer: SelectRenderer
            }}>
            <AgGridColumn
              field="id"
              resizable
              sortable
              filter
              width={100}
              suppressSizeToFit={true}
              headerCheckboxSelection={true}
              checkboxSelection={true}></AgGridColumn>
            <AgGridColumn field="name" resizable sortable filter></AgGridColumn>
            {/* <AgGridColumn field="slug" resizable sortable filter></AgGridColumn> */}
            <AgGridColumn field="path" resizable sortable filter></AgGridColumn>
            <AgGridColumn field="slug" cellRenderer="selectRenderer" cellRendererParams={{
              placeholder: "Select...",
              items: [{
                label: "Europe",
                value: 'europe'
              }, {
                label: "Toto",
                value: 'toto'
              }, {
                label: "Tata",
                value: 'tata'
              }, {
                label: "Titi",
                value: 'titi'
              }]
            }} />
            <AgGridColumn cellRenderer="editBtnRenderer" />
          </AgGridReact>
        </div>
      }
    </Fragment>
  );
};

export default Teams;