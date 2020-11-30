import React, { FC, Fragment, useRef, useState, useEffect } from "react";
import { IOrganization } from "@/index.d";
import { useQuery, useQueryCache } from "react-query";
import { apiRest } from "@/lib/api";
import {
  Box,
  Button,
  ButtonGroup,
  ClickAwayListener,
  Grow,
  makeStyles,
  MenuItem,
  MenuList,
  Paper,
  Popper,
  Toolbar,
} from "@material-ui/core";
import {
  Add as AddIcon,
  ArrowDropDown as ArrowDropDownIcon,
} from "@material-ui/icons";
import { useRouter } from "next/router";

import { useTemplate } from "@/components/Template";
import ETKFormOrganization, {
  ETKFormOrganizationActions,
} from "@/components/Organization/Form/Form";
import ETKFormWorkingArea, {
  ETKFormWorkingAreaActions,
} from "@/components/Organization/WorkingArea/Form";
import TeamsTable from "@/components/Organization/Teams/TeamsTable";
import { useTranslation } from "react-i18next";
import { useAppContext } from "@/providers/AppContext";

interface TeamsProps {
  organization: IOrganization;
  value: string | string[];
  index: string;
}

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

const actionOptions = [
  {
    label: "Archive",
    format: "archive",
  },
  {
    label: "Delete",
    format: "delete",
  },
];

const Teams: FC<TeamsProps> = (props) => {
  const classes = useStyles();
  const { dialog, theme } = useTemplate();
  const formEditRef = useRef<ETKFormOrganizationActions>();
  const formAreaRef = useRef<ETKFormWorkingAreaActions>();
  const { t } = useTranslation(["components", "common"]);
  const router = useRouter();
  const { user, setUser } = useAppContext();

  const cache = useQueryCache();
  const queryName = `teams_${props.organization.id}`;
  const { status, data, error, isFetching } = useQuery(
    queryName,
    async () => {
      const data = await apiRest.organization.teams(props.organization.id);
      return data;
    },
    {
      enabled: Boolean(props.organization),
    }
  );

  const anchorRef = useRef(null);
  const [disableActions, setDisableActions] = useState(true);
  const [open, setOpen] = useState(false);
  const [selectedAction, setSelectedAction] = useState(0);
  const [selectedTeams, setSelectedTeams] = useState([]);

  useEffect(() => {
    setDisableActions(Boolean(selectedTeams.length == 0));
  }, [selectedTeams]);

  const onSelected = (team_ids) => {
    setSelectedTeams(team_ids);
  };

  const handleClick = () => {
    console.info(
      `Export format selected ${actionOptions[selectedAction].format}`
    );
  };

  const handleMenuItemClick = (event, index) => {
    setSelectedAction(index);
    setOpen(false);
  };

  const handleToggle = () => {
    setOpen((prevOpen) => !prevOpen);
  };

  const handleClose = (event) => {
    if (anchorRef.current && anchorRef.current.contains(event.target)) {
      return;
    }

    setOpen(false);
  };

  function openForm(organization?) {
    const isNew = !Boolean(organization);
    const dialogActions = [
      {
        label: t("common:buttons.cancel"),
      },
      {
        label: t("common:buttons.send"),
        variant: "contained",
        color: "secondary",
        noClose: true,
        onClick: addItem,
      },
    ];

    dialog.current.open({
      title: t(`components:Team.dialogTitle${isNew ? "Create" : "Edit"}`),
      content: (
        <ETKFormOrganization
          ref={formEditRef}
          organization={
            organization || {
              parent_id: props.organization.id,
            }
          }
        />
      ),
      actions: dialogActions,
    });
  }

  const addItem = async () => {
    const isOk = await formEditRef.current.submit();
    if (isOk) {
      dialog.current.close();
      const newUser = await apiRest.users.me();

      newUser.currentOrganization = user.currentOrganization;
      setUser(newUser);
      //TODO Add a row to the array instead of reload the complete collection
      cache.invalidateQueries(queryName);
    }
  };

  function openArea(organization) {
    const dialogActions = [
      {
        label: t("common:buttons.cancel"),
      },
      {
        label: t("common:buttons.send"),
        variant: "contained",
        color: "secondary",
        noClose: true,
        onClick: editWorkingArea,
      },
    ];

    dialog.current.open({
      title: t("components:Organization.WorkingArea.dialogTitle"),
      content: (
        <ETKFormWorkingArea ref={formAreaRef} organization={organization} />
      ),
      actions: dialogActions,
    });
  }

  const editWorkingArea = async () => {
    const isOk = await formAreaRef.current.submit();
    if (isOk) {
      dialog.current.close();
      //TODO Add a row to the array instead of reload the complete collection
      cache.invalidateQueries("teams");
    }
  };

  const openTeamPage = (id) => {
    router.push(`/organization/${id}`);
  };

  return (
    <Fragment>
      <Toolbar className={classes.toolbar}>
        <Box className={classes.root} />
        <ButtonGroup
          variant="contained"
          disabled={disableActions}
          size="small"
          color="secondary"
          ref={anchorRef}
          aria-label="split button"
        >
          <Button size="small" color="secondary" onClick={handleClick}>
            {actionOptions[selectedAction].label}
          </Button>
          <Button
            size="small"
            color="secondary"
            aria-controls={open ? "split-button-menu" : undefined}
            aria-expanded={open ? "true" : undefined}
            aria-label="select export format"
            aria-haspopup="menu"
            onClick={handleToggle}
          >
            <ArrowDropDownIcon />
          </Button>
        </ButtonGroup>
        <Popper
          open={open}
          anchorEl={anchorRef.current}
          role={undefined}
          transition
          modifiers={{
            flip: {
              enabled: true,
            },
            preventOverflow: {
              enabled: true,
              boundariesElement: "window",
            },
          }}
        >
          {({ TransitionProps, placement }) => (
            <Grow
              {...TransitionProps}
              style={{
                transformOrigin:
                  placement === "bottom" ? "center top" : "center bottom",
              }}
            >
              <Paper>
                <ClickAwayListener onClickAway={handleClose}>
                  <MenuList id="split-button-menu">
                    {actionOptions.map((option, index) => (
                      <MenuItem
                        key={option.label}
                        selected={index === selectedAction}
                        onClick={(event) => handleMenuItemClick(event, index)}
                      >
                        {option.label}
                      </MenuItem>
                    ))}
                  </MenuList>
                </ClickAwayListener>
              </Paper>
            </Grow>
          )}
        </Popper>
        <Button
          variant="contained"
          size="small"
          color="primary"
          className={classes.button}
          startIcon={<AddIcon />}
          onClick={() => {
            openForm();
          }}
        >
          {t("Teams.buttonAdd")}
        </Button>
      </Toolbar>
      <TeamsTable
        rows={data}
        openArea={openArea}
        openTeamPage={openTeamPage}
        openForm={openForm}
        onSelected={onSelected}
      />
    </Fragment>
  );
};

export default Teams;
