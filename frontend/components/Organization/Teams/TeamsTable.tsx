import React, { useEffect, useState, SyntheticEvent } from "react";
import {
  Checkbox,
  Table,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TableBody,
  MenuItem,
  IconButton,
  Menu,
  ListItemIcon,
  ListItemText,
  Button,
  Snackbar,
  Tooltip,
} from "@material-ui/core";
import MuiAlert, { AlertProps, Color } from "@material-ui/lab/Alert";
import {
  Edit,
  MoreHoriz as MoreHorizIcon,
  PhotoSizeSelectSmall,
  Visibility,
  Archive as ArchiveIcon,
  Delete as DeleteIcon,
} from "@material-ui/icons";
import { useTranslation } from "react-i18next";
import { IOrganization } from "@/index";
import useAPI from "@/lib/useApi";

export interface ETKOrganizationTeamsTableProps {
  organizationId: number;
  rows?: IOrganization[];
  onSelected?(selection?: number[]): void;
  openArea?(data?: IOrganization): void;
  openForm?(data?: IOrganization): void;
  openTeamPage?(data_id?: number): void;
  discardTeams?(): void;
  deleteTeams?(): void;
}

const defaultProps: ETKOrganizationTeamsTableProps = {
  organizationId: 1,
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

const SnackAlert: React.FC<SnackAlertProps> = ({
  open,
  severity,
  message = "",
}) => {
  const [isOpen, setIsOpen] = React.useState(open);
  const handleClose = (
    event: SyntheticEvent<Element, Event>,
    reason: string
  ) => {
    setIsOpen(false);
  };

  useEffect(() => {
    setIsOpen(open);
  }, [open]);

  return (
    <Snackbar
      open={isOpen}
      autoHideDuration={3000}
      onClose={handleClose}
      anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
    >
      <Alert onClose={handleClose} severity={severity}>
        {message}
      </Alert>
    </Snackbar>
  );
};

const ETKTeamsTable: React.FC<ETKOrganizationTeamsTableProps> = (props) => {
  const { t } = useTranslation("components");
  const { api } = useAPI();
  const { apiETK } = api;
  const [headers] = React.useState([
    "Teams.Table.headers.name",
    "Teams.Table.headers.total_members",
    "Teams.Table.headers.total_trees",
    "Teams.Table.headers.actions",
  ]);
  const [selected, setSelected] = useState([] as number[]);
  const [actionsMenuAnchorEl, setActionsMenuAnchorEl] = useState(null);
  const [openAlert, setOpenAlert] = useState(false);
  const [alertMessage, setAlertMesagge] = useState<
    Pick<SnackAlertProps, "message" | "severity">
  >({
    message: "",
    severity: "success",
  });
  const [rows, setRows] = useState([]);

  useEffect(() => {
    setRows(props.rows);
  }, [props.rows]);

  const handleClick = (event: SyntheticEvent) => {
    setActionsMenuAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setActionsMenuAnchorEl(null);
  };

  const triggerDiscard = () => {
    props.discardTeams();
    setSelected([]);
  };

  const triggerDelete = () => {
    props.deleteTeams();
    setSelected([]);
  };

  const isSelected = (id) => selected.indexOf(id) !== -1;

  const onSelectAllClick = (e) => {
    if (e.target.checked) {
      const newSelected = rows.map((n) => n.id);
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
    <>
      <SnackAlert
        open={openAlert}
        severity={alertMessage.severity}
        message={alertMessage.message}
      />
      <TableContainer>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell padding="checkbox">
                <Checkbox
                  indeterminate={
                    selected.length > 0 && selected.length < rows.length
                  }
                  checked={rows.length > 0 && selected.length === rows.length}
                  onChange={onSelectAllClick}
                  color="primary"
                />
              </TableCell>
              <TableCell padding="checkbox">
                <IconButton
                  disabled={!selected.length}
                  size="small"
                  aria-owns={actionsMenuAnchorEl ? "membersActionsMenu" : null}
                  aria-haspopup="true"
                  onClick={handleClick}
                >
                  <MoreHorizIcon />
                </IconButton>
                <Menu
                  elevation={0}
                  id="membersActionsMenu"
                  anchorEl={actionsMenuAnchorEl}
                  open={Boolean(actionsMenuAnchorEl)}
                  onClose={handleClose}
                >
                  <MenuItem onClick={() => triggerDiscard()}>
                    <ListItemIcon>
                      <ArchiveIcon />
                    </ListItemIcon>
                    <ListItemText primary="Archiver" />
                  </MenuItem>
                  <MenuItem onClick={() => triggerDelete()}>
                    <ListItemIcon>
                      <DeleteIcon />
                    </ListItemIcon>
                    <ListItemText primary="Delete" />
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
            {rows.length > 0 &&
              rows.map((row) => {
                const isItemSelected = isSelected(row.id);
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
                        checked={isItemSelected}
                        color="primary"
                        onClick={(e) => onRowClick(e, row.id)}
                      />
                    </TableCell>
                    <TableCell padding="checkbox"></TableCell>
                    <TableCell scope="row">
                      <Button
                        style={{ justifyContent: "flex-start" }}
                        size="small"
                        onClick={() => props.openTeamPage(row.id)}
                      >
                        {row.name}
                      </Button>
                    </TableCell>
                    <TableCell align="center" style={{ width: 100 }}>
                      {row.total_members || "-"}
                    </TableCell>
                    <TableCell align="center" style={{ width: 100 }}>
                      {row.total_trees || "-"}
                    </TableCell>
                    <TableCell style={{ width: 120 }}>
                      <Tooltip title={t("Teams.tooltipWorkingAreaEdit")}>
                        <IconButton
                          size="small"
                          color="primary"
                          onClick={() => {
                            props.openArea(row);
                          }}
                        >
                          <PhotoSizeSelectSmall fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title={t("Teams.tooltipInfoEdit")}>
                        <IconButton
                          size="small"
                          color="primary"
                          onClick={() => {
                            props.openForm(row);
                          }}
                        >
                          <Edit fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title={t("Teams.tooltipLink")}>
                        <IconButton
                          size="small"
                          color="primary"
                          onClick={() => {
                            props.openTeamPage(row.id);
                          }}
                        >
                          <Visibility fontSize="small" />
                        </IconButton>
                      </Tooltip>
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

ETKTeamsTable.defaultProps = defaultProps;

export default ETKTeamsTable;
