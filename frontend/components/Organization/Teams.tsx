import { FC, Fragment, useState } from "react";
import { TOrganization } from "@/pages/organization/[id]";
import { useQuery } from "react-query";
import { apiRest } from "@/lib/api"
import { Box, Button, Toolbar } from "@material-ui/core";
import { AgGridColumn, AgGridReact } from 'ag-grid-react';

import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-alpine.css';
import CellGridSelectRenderer from "./CellGridSelectRenderer";

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
              selectRenderer: CellGridSelectRenderer
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
              }],
              onChange: (params, newValue, oldValue) => {
                console.log(params.data.id, params.data.slug);
              }
            }} />
            <AgGridColumn cellRenderer="editBtnRenderer" />
          </AgGridReact>
        </div>
      }
    </Fragment>
  );
};

export default Teams;