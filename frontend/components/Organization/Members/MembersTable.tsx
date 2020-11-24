import React, { useEffect, useState, SyntheticEvent } from "react";
import {
  Checkbox,
  Table,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TableBody,
  Select,
  MenuItem,
  IconButton,
  Menu,
  MenuList,
  ListItemIcon,
  ListItemText,
  Box,
  Snackbar,
  SnackbarProps,
} from "@material-ui/core";
import MuiAlert, { AlertProps, Color } from "@material-ui/lab/Alert";
import { Block as BlockIcon, MoreHoriz as MoreHorizIcon } from "@material-ui/icons";
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
interface SnackAlertProps {
  open: boolean;
  severity: Color;
  message: string;
}

function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

const SnackAlert: React.FC<SnackAlertProps> = ({ open, severity, message = "" }) => {
  const [isOpen, setIsOpen] = React.useState(open);
  const handleClose = (event: SyntheticEvent<Element, Event>, reason: string) => {
    // if (reason === "clickaway") {
    //   return;
    // }
    setIsOpen(false);
  };

  useEffect(() => {
    setIsOpen(open);
  }, [open]);

  return (
    <Snackbar open={isOpen} autoHideDuration={3000} onClose={handleClose} anchorOrigin={{ vertical: "bottom", horizontal: "center" }}>
      <Alert onClose={handleClose} severity={severity}>
        {message}
      </Alert>
    </Snackbar>
  );
};

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

const ETKMembersTable: React.FC<ETKOrganizationMemberTableProps> = (props) => {
  const { t } = useTranslation("components");
  const [headers] = React.useState([
    "Organization.Members.Table.headers.email",
    "Organization.Members.Table.headers.name",
    "Organization.Members.Table.headers.status",
    "Organization.Members.Table.headers.role",
  ]);
  const [selected, setSelected] = useState([] as number[]);
  const [actionsMenuAnchorEl, setActionsMenuAnchorEl] = useState(null);
  const [openAlert, setOpenAlert] = useState(false);
  const [alertMessage, setAlertMesagge] = useState("");

  const handleClick = (event: SyntheticEvent) => {
    setActionsMenuAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setActionsMenuAnchorEl(null);
  };

  const detachMembers = () => {
    setAlertMesagge(`TODO: AJAX call to detach members with IDS: [${selected.join(", ")}]`);
    setOpenAlert(true);
    setActionsMenuAnchorEl(null);
    setTimeout(() => setOpenAlert(false), 3000);
  };

  const handleUserRoleChange = (userID) => {
    setAlertMesagge(`TODO: AJAX call to change role for User#${userID}`);
    setOpenAlert(true);
    setActionsMenuAnchorEl(null);
    setTimeout(() => setOpenAlert(false), 3000);
    console.log("change role", userID);
  };

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
    <>
      <SnackAlert open={openAlert} severity="warning" message={alertMessage} />
      <TableContainer>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell style={{ minWidth: "96px", maxWidth: "96px" }}>
                <Box flexDirection="row">
                  <Checkbox
                    indeterminate={selected.length > 0 && selected.length < props.rows.length}
                    checked={props.rows.length > 0 && selected.length === props.rows.length}
                    onChange={onSelectAllClick}
                    color="primary"
                  />
                  {selected.length > 0 && (
                    <>
                      <IconButton aria-owns={actionsMenuAnchorEl ? "membersActionsMenu" : null} aria-haspopup="true" onClick={handleClick}>
                        <MoreHorizIcon />
                      </IconButton>
                      <Menu id="membersActionsMenu" anchorEl={actionsMenuAnchorEl} open={Boolean(actionsMenuAnchorEl)} onClose={handleClose}>
                        <MenuList>
                          <MenuItem onClick={detachMembers}>
                            <ListItemIcon>
                              <BlockIcon />
                            </ListItemIcon>
                            <ListItemText primary="Retirer du groupe" />
                          </MenuItem>
                        </MenuList>
                      </Menu>
                    </>
                  )}
                </Box>
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
                  <TableCell style={{ minWidth: "96px", maxWidth: "96px" }}>
                    <Checkbox checked={isItemSelected} color="primary" onClick={(e) => onRowClick(e, row.id)} />
                  </TableCell>
                  <TableCell scope="row">{row.email}</TableCell>
                  <TableCell>{row.name}</TableCell>
                  <TableCell>{row.status}</TableCell>
                  <TableCell>
                    <SelectRenderer value={row.role} handleChange={() => handleUserRoleChange(row.id)} />
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
};

ETKMembersTable.defaultProps = defaultProps;

export default ETKMembersTable;
