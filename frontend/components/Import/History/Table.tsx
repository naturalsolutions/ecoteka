import React, { useEffect } from "react";
import {
  Checkbox,
  Table,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TableBody,
} from "@material-ui/core";
import { useTranslation } from "react-i18next";

import Geofile from "../../Geofile";

export interface ETKImportHistoryTableProps {
  rows?: Geofile[];
  onSelected?(selection?: string[]): void;
}

const defaultProps: ETKImportHistoryTableProps = {
  rows: [],
};

const ETKImportHistoryTable: React.FC<ETKImportHistoryTableProps> = (props) => {
  const { t } = useTranslation("components");
  const [headers] = React.useState([
    "ImportHistoryTable.headers.file",
    "ImportHistoryTable.headers.trees",
    "ImportHistoryTable.headers.crs",
    "ImportHistoryTable.headers.importDate",
    "ImportHistoryTable.headers.importStatus",
  ]);
  const [selected, setSelected] = React.useState([] as string[]);

  const isSelected = (name) => selected.indexOf(name) !== -1;

  const onSelectAllClick = (e) => {
    if (e.target.checked) {
      const newSelected = props.rows.map((n) => n.name);
      setSelected(newSelected);
      return;
    }

    setSelected([]);
  };

  const onRowClick = (e, name) => {
    const selectedIndex = selected.indexOf(name);

    let newSelected = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, name);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1)
      );
    }

    setSelected(newSelected);
  };

  useEffect(() => {
    if (props.onSelected && typeof props.onSelected === "function") {
      props.onSelected(selected);
    }
  }, [selected]);

  return (
    <TableContainer>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>
              <Checkbox
                indeterminate={
                  selected.length > 0 && selected.length < props.rows.length
                }
                checked={
                  props.rows.length > 0 && selected.length === props.rows.length
                }
                onChange={onSelectAllClick}
              />
            </TableCell>
            {headers.map((header, index) => (
              <TableCell key={`header-${index}`}>
                <strong>{t(header)}</strong>
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {props.rows.map((row) => {
            const isItemSelected = isSelected(row.name);
            return (
              <TableRow
                hover
                key={row.name}
                selected={isItemSelected}
                role="checkbox"
                aria-checked={isItemSelected}
                onClick={(e) => onRowClick(e, row.name)}
              >
                <TableCell>
                  <Checkbox checked={isItemSelected} />
                </TableCell>
                <TableCell scope="row">{row.original_name}</TableCell>
                <TableCell>{row.count}</TableCell>
                <TableCell>{row.crs}</TableCell>
                <TableCell>
                  {new Date(row.imported_date).toLocaleString()}
                </TableCell>
                <TableCell>{row.status}</TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

ETKImportHistoryTable.defaultProps = defaultProps;

export default ETKImportHistoryTable;
