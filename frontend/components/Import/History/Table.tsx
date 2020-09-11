import React from "react";
import { makeStyles, createStyles } from "@material-ui/core/styles";
import {
  Checkbox,
  Table,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TableBody,
} from "@material-ui/core";

import Geofile from "../../Geofile";

export interface ETKImportHistoryTableProps {
  headers: [];
  rows?: Geofile[];
}

const defaultProps: ETKImportHistoryTableProps = {
  headers: [],
  rows: [],
};

const useStyles = makeStyles(() => createStyles({}));

const ETKImportHistoryTable: React.FC<ETKImportHistoryTableProps> = (props) => {
  const classes = useStyles();

  return (
    <TableContainer>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>
              <Checkbox />
            </TableCell>
            {props.headers.map((header, index) => (
              <TableCell key={`header-${index}`}>{header}</TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {props.rows.map((row) => (
            <TableRow key={row.name}>
              <TableCell>
                <Checkbox />
              </TableCell>
              <TableCell scope="row">{row.original_name}</TableCell>
              <TableCell>{row.uploaded_date}</TableCell>
              <TableCell>{row.status}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

ETKImportHistoryTable.defaultProps = defaultProps;

export default ETKImportHistoryTable;
