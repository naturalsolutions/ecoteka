import React, { useEffect } from "react";
import { Checkbox, Table, TableCell, TableContainer, TableHead, TableRow, TableBody, Select, MenuItem } from "@material-ui/core";
import { useTranslation } from "react-i18next";

interface IMemberProps {
  id: number;
  email: string;
  name?: string;
  role: string;
  status: string;
}

export interface ETKOrganizationMemberTableProps {
  rows?: IMemberProps[];
  onSelected?(selection?: number[]): void;
}

const defaultProps: ETKOrganizationMemberTableProps = {
  rows: [],
};

interface SelectRendererProps {
  value: string;
  handleChange?: any;
}

const SelectRenderer: React.FC<SelectRendererProps> = ({ value, handleChange }) => {
  const placeholder = "Définir le rôle";
  const roles = [
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
      value: "contributeur",
    },
    {
      label: "Lecteur",
      value: "reader",
    },
    {
      label: "Invité",
      value: "guest",
    },
  ];
  return (
    <Select value={value} displayEmpty onChange={handleChange} autoWidth>
      <MenuItem value="" disabled>
        {placeholder}
      </MenuItem>
      {roles.map((role, i) => {
        return (
          <MenuItem value={role.value} key={i}>
            {role.label}
          </MenuItem>
        );
      })}
    </Select>
  );
};

const ETKImportHistoryTable: React.FC<ETKOrganizationMemberTableProps> = (props) => {
  const { t } = useTranslation("components");
  const [headers] = React.useState([
    "Organization.Members.Table.headers.email",
    "Organization.Members.Table.headers.name",
    "Organization.Members.Table.headers.status",
    "Organization.Members.Table.headers.role",
  ]);
  const [selected, setSelected] = React.useState([] as number[]);

  const isSelected = (id) => selected.indexOf(id) !== -1;

  const onSelectAllClick = (e) => {
    if (e.target.checked) {
      const newSelected = props.rows.map((n) => n.id);
      setSelected(newSelected);
      return;
    }

    setSelected([]);
  };

  const onRowClick = (e, id) => {
    const selectedIndex = selected.indexOf(id);

    let newSelected = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, id);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(selected.slice(0, selectedIndex), selected.slice(selectedIndex + 1));
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
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell>
              <Checkbox
                indeterminate={selected.length > 0 && selected.length < props.rows.length}
                checked={props.rows.length > 0 && selected.length === props.rows.length}
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
            const isItemSelected = isSelected(row.id);
            return (
              <TableRow hover key={row.id} selected={isItemSelected} role="checkbox" aria-checked={isItemSelected}>
                <TableCell>
                  <Checkbox checked={isItemSelected} color="secondary" onClick={(e) => onRowClick(e, row.id)} />
                </TableCell>
                <TableCell scope="row">{row.email}</TableCell>
                <TableCell>{row.name}</TableCell>
                <TableCell>{row.status}</TableCell>
                <TableCell>
                  <SelectRenderer value={row.role} />
                </TableCell>
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
