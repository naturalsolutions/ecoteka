import React, { useState, SyntheticEvent, useEffect } from "react";
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
  ListItemIcon,
  ListItemText,
  withStyles,
  createStyles,
  InputBase,
  TextField,
  Theme,
} from "@material-ui/core";
import SnackAlert, { SnackAlertProps } from "@/components/Feedback/SnackAlert";
import {
  Block as BlockIcon,
  MoreHoriz as MoreHorizIcon,
} from "@material-ui/icons";
import { useTranslation } from "react-i18next";
import useApi from "@/lib/useApi";
import { IMember } from "@/index";

export interface ETKOrganizationMemberTableProps {
  organizationId: number;
  selectedMembers: IMember[];
  rows?: IMember[];
  onSelected?(selection?: IMember[]): void;
  onDetachMembers?(): void;
  onMemberUpdate?(updatedMember: IMember): void;
}

const defaultProps: ETKOrganizationMemberTableProps = {
  organizationId: 1,
  rows: [],
  selectedMembers: [],
};

interface SelectRendererProps {
  value: string;
  handleChange?: any;
}

const BootstrapInput = withStyles((theme: Theme) =>
  createStyles({
    root: {
      "label + &": {
        marginTop: theme.spacing(3),
      },
    },
    input: {
      borderRadius: 4,
      position: "relative",
      backgroundColor: theme.palette.background.paper,
      border: "1px solid #ced4da",
      fontSize: 16,
      padding: "5px 26px 5px 12px",
      transition: theme.transitions.create(["border-color", "box-shadow"]),
      "&:focus": {
        borderRadius: 4,
        borderColor: "#80bdff",
        boxShadow: "0 0 0 0.2rem rgba(0,123,255,.25)",
      },
    },
  })
)(InputBase);

const SelectRenderer: React.FC<SelectRendererProps> = ({
  value,
  handleChange,
}) => {
  const { t } = useTranslation(["components", "common"]);
  const placeholder = t(
    "components:Organization.Members.Table.roles.defineRole"
  );
  const roles = [
    {
      label: t("components:Organization.Members.Table.roles.manager"),
      value: "manager",
    },
    {
      label: t("components:Organization.Members.Table.roles.contributor"),
      value: "contributor",
    },
    {
      label: t("components:Organization.Members.Table.roles.reader"),
      value: "reader",
    },
    {
      label: t("components:Organization.Members.Table.roles.guest"),
      value: "guest",
    },
  ];
  return (
    <Select
      input={<BootstrapInput />}
      value={value}
      displayEmpty
      onChange={handleChange}
      autoWidth
    >
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

const ETKMembersTable: React.FC<ETKOrganizationMemberTableProps> = ({
  organizationId,
  selectedMembers,
  rows,
  onSelected,
  onDetachMembers,
  onMemberUpdate,
}) => {
  const { api } = useApi();
  const { apiETK } = api;
  const { t } = useTranslation("components");
  const [headers] = React.useState([
    "Organization.Members.Table.headers.email",
    "Organization.Members.Table.headers.name",
    "Organization.Members.Table.headers.role",
  ]);
  const [actionsMenuAnchorEl, setActionsMenuAnchorEl] = useState(null);
  const [openAlert, setOpenAlert] = useState(false);
  const [alertMessage, setAlertMesagge] = useState<
    Pick<SnackAlertProps, "message" | "severity">
  >({
    message: "",
    severity: "success",
  });
  const [privateRows, setPrivateRows] = useState<IMember[]>([]);

  useEffect(() => {
    setPrivateRows([...rows]);
  }, [rows]);

  const handleClick = (event: SyntheticEvent) => {
    setActionsMenuAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setActionsMenuAnchorEl(null);
  };

  const triggerAlert = ({ message, severity }) => {
    setAlertMesagge({
      message: message,
      severity: severity,
    });
    setOpenAlert(true);
    setTimeout(() => setOpenAlert(false), 3000);
  };

  const handleUserRoleChange = async (
    user: IMember,
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { value: role } = event.target;
    try {
      const {
        data,
        status,
      } = await apiETK.patch(
        `/organization/${organizationId}/members/${user.id}/role`,
        { role }
      );

      if (status === 200) {
        onMemberUpdate(data);
        triggerAlert({
          message: t(
            "components:Organization.Members.Table.updateMember.success"
          ),
          severity: "success",
        });
      }
    } catch (e) {
      triggerAlert({
        message: t("components:Organization.Members.Table.updateMember.error"),
        severity: "error",
      });
    }
  };

  const handleUserUpdate = async (user: IMember) => {
    try {
      const { hashed_password, ...payload } = user;
      const { status } = await apiETK.put(`/users/${user.id}`, payload);

      if (status === 200) {
        triggerAlert({
          message: t(
            "components:Organization.Members.Table.updateMember.success"
          ),
          severity: "success",
        });
      }
    } catch (e) {
      triggerAlert({
        message: t("components:Organization.Members.Table.updateMember.error"),
        severity: "error",
      });
    }
  };

  const isSelected = (member: IMember) => {
    const { id } = member;
    return (
      selectedMembers
        .map(function (member) {
          return member.id;
        })
        .indexOf(id) !== -1
    );
  };

  const onSelectAllClick = (e) => {
    if (e.target.checked) {
      const newSelected = rows.filter(
        (r) => ["admin", "owner"].indexOf(r.role) === -1
      );
      newSelected.length === selectedMembers.length
        ? onSelected([])
        : onSelected(newSelected);
      return;
    }
    onSelected([]);
  };

  const onRowClick = (e, member: IMember) => {
    const { id } = member;
    const selectedIndex = selectedMembers
      .map(function (member) {
        return member.id;
      })
      .indexOf(id);

    let newSelected = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selectedMembers, member);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selectedMembers.slice(1));
    } else if (selectedIndex === selectedMembers.length - 1) {
      newSelected = newSelected.concat(selectedMembers.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selectedMembers.slice(0, selectedIndex),
        selectedMembers.slice(selectedIndex + 1)
      );
    }

    onSelected(newSelected);
  };

  return (
    <>
      <SnackAlert
        open={openAlert}
        severity={alertMessage.severity}
        message={alertMessage.message}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      />
      <TableContainer>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell padding="checkbox">
                <Checkbox
                  indeterminate={
                    selectedMembers.length > 0 &&
                    selectedMembers.length < rows.length
                  }
                  checked={
                    rows.length > 0 && selectedMembers.length === rows.length
                  }
                  onChange={onSelectAllClick}
                  color="primary"
                />
              </TableCell>
              <TableCell padding="checkbox">
                <IconButton
                  disabled={!selectedMembers.length}
                  aria-owns={actionsMenuAnchorEl ? "membersActionsMenu" : null}
                  aria-haspopup="true"
                  onClick={handleClick}
                >
                  <MoreHorizIcon />
                </IconButton>
                <Menu
                  id="membersActionsMenu"
                  anchorEl={actionsMenuAnchorEl}
                  open={Boolean(actionsMenuAnchorEl)}
                  onClose={handleClose}
                >
                  <MenuItem onClick={onDetachMembers}>
                    <ListItemIcon>
                      <BlockIcon />
                    </ListItemIcon>
                    <ListItemText primary="Retirer du groupe" />
                  </MenuItem>
                </Menu>
              </TableCell>
              {headers.map((header, index) => (
                <TableCell key={`header-${index}`}>
                  <strong>{t(header)}</strong>
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {privateRows.map((row, index) => {
              const isItemSelected = isSelected(row);

              return (
                <TableRow
                  hover
                  key={row.id}
                  selected={isItemSelected}
                  role="checkbox"
                  aria-checked={isItemSelected}
                >
                  <TableCell padding="checkbox">
                    <Checkbox
                      disabled={Boolean(
                        row.role === "admin" || row.role === "owner"
                      )}
                      checked={isItemSelected}
                      color="primary"
                      onClick={(e) => onRowClick(e, row)}
                    />
                  </TableCell>
                  <TableCell padding="checkbox" />
                  <TableCell scope="row">{row.email}</TableCell>
                  <TableCell>
                    <TextField
                      fullWidth
                      size="small"
                      variant="outlined"
                      value={privateRows[index].full_name}
                      onChange={(e) => {
                        if (privateRows[index].full_name !== e.target.value) {
                          const newRows = [...privateRows];

                          newRows[index].full_name = e.target.value;
                          setPrivateRows(newRows);
                        }
                      }}
                      onBlur={() => {
                        handleUserUpdate(row);
                      }}
                    />
                  </TableCell>
                  <TableCell>
                    {(() => {
                      switch (row.role) {
                        case "admin":
                        case "owner":
                          return t(
                            `components:Organization.Members.Table.roles.${row.role}`
                          );
                        default:
                          return (
                            <SelectRenderer
                              value={row.role}
                              handleChange={(e) => handleUserRoleChange(row, e)}
                            />
                          );
                      }
                    })()}
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
