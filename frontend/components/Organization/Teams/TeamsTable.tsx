import React, { useState, SyntheticEvent } from "react";
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
  Tooltip,
} from "@material-ui/core";
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
  selectedTeams: number[];
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
  selectedTeams: [],
};

const ETKTeamsTable: React.FC<ETKOrganizationTeamsTableProps> = ({
  organizationId,
  rows,
  selectedTeams,
  onSelected,
  openArea,
  openForm,
  openTeamPage,
  discardTeams,
  deleteTeams,
}) => {
  const { t } = useTranslation("components");
  const { api } = useAPI();
  const { apiETK } = api;
  const [headers] = React.useState([
    "Teams.Table.headers.name",
    "Teams.Table.headers.total_members",
    "Teams.Table.headers.total_trees",
    "Teams.Table.headers.actions",
  ]);
  const [actionsMenuAnchorEl, setActionsMenuAnchorEl] = useState(null);

  const handleClick = (event: SyntheticEvent) => {
    setActionsMenuAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setActionsMenuAnchorEl(null);
  };

  const triggerDiscard = () => {
    discardTeams();
    onSelected([]);
  };

  const triggerDelete = () => {
    deleteTeams();
    onSelected([]);
  };

  const isSelected = (id) => selectedTeams.indexOf(id) !== -1;

  const onSelectAllClick = (e) => {
    if (e.target.checked) {
      const newSelected = rows.map((n) => n.id);
      onSelected(newSelected);
      return;
    }

    onSelected([]);
  };

  const onRowClick = (e, id) => {
    const selectedIndex = selectedTeams.indexOf(id);

    let newSelected = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selectedTeams, id);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selectedTeams.slice(1));
    } else if (selectedIndex === selectedTeams.length - 1) {
      newSelected = newSelected.concat(selectedTeams.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selectedTeams.slice(0, selectedIndex),
        selectedTeams.slice(selectedIndex + 1)
      );
    }

    onSelected(newSelected);
  };

  return (
    <>
      <TableContainer>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell padding="checkbox">
                <Checkbox
                  indeterminate={
                    selectedTeams.length > 0 &&
                    selectedTeams.length < rows.length
                  }
                  checked={
                    rows.length > 0 && selectedTeams.length === rows.length
                  }
                  onChange={onSelectAllClick}
                  color="primary"
                />
              </TableCell>
              <TableCell padding="checkbox">
                <IconButton
                  disabled={!selectedTeams.length}
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
                    <ListItemText primary={t(`common:buttons.archive`)} />
                  </MenuItem>
                  <MenuItem onClick={() => triggerDelete()}>
                    <ListItemIcon>
                      <DeleteIcon />
                    </ListItemIcon>
                    <ListItemText primary={t(`common:buttons.delete`)} />
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
                        onClick={() => openTeamPage(row.id)}
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
                            openArea(row);
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
                            openForm(row);
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
                            openTeamPage(row.id);
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
