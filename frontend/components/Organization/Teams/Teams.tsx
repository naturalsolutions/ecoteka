import React, {
  FC,
  Fragment,
  useRef,
  useState,
  useEffect,
  SyntheticEvent,
} from "react";
import { IOrganization } from "@/index.d";
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
  Snackbar,
  Toolbar,
} from "@material-ui/core";
import MuiAlert, { Color } from "@material-ui/lab/Alert";
import {
  Add as AddIcon,
  ArrowDropDown as ArrowDropDownIcon,
} from "@material-ui/icons";
import { useRouter } from "next/router";

import { useAppLayout } from "@/components/AppLayout/Base";
import ETKFormOrganization, {
  ETKFormOrganizationActions,
} from "@/components/Organization/Form/Form";
import ETKFormWorkingArea, {
  ETKFormWorkingAreaActions,
} from "@/components/Organization/WorkingArea/Form";
import TeamsTable from "@/components/Organization/Teams/TeamsTable";
import { useTranslation } from "react-i18next";
import useAPI from "@/lib/useApi";

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
    padding: 0,
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

const Teams: FC<TeamsProps> = (props) => {
  const classes = useStyles();
  const { dialog } = useAppLayout();
  const formEditRef = useRef<ETKFormOrganizationActions>();
  const formAreaRef = useRef<ETKFormWorkingAreaActions>();
  const { t } = useTranslation(["components", "common"]);
  const router = useRouter();
  const { api } = useAPI();
  const { apiETK } = api;
  const [data, setData] = useState([]);
  const anchorRef = useRef(null);
  const [disableActions, setDisableActions] = useState(true);
  const [open, setOpen] = useState(false);
  const [selectedAction, setSelectedAction] = useState(0);
  const [selectedTeams, setSelectedTeams] = useState([]);
  const [openAlert, setOpenAlert] = useState(false);
  const [alertMessage, setAlertMesagge] = useState<
    Pick<SnackAlertProps, "message" | "severity">
  >({
    message: "",
    severity: "success",
  });

  useEffect(() => {
    getData(props.organization.id);
  }, [props.organization]);

  useEffect(() => {
    setDisableActions(Boolean(selectedTeams.length == 0));
  }, [selectedTeams]);

  const getData = async (organizationId: number) => {
    try {
      const response = await apiETK.get(
        `/organization/${organizationId}/teams`
      );
      const { data, status } = response;
      if (status === 200) {
        setData(data);
      }
    } catch (e) {
      //
    }
  };

  const onSelected = (team_ids) => {
    setSelectedTeams(team_ids);
  };

  const handleClick = () => {
    switch (actionOptions[selectedAction].format) {
      case "archive":
        discardTeams();
        break;
      case "delete":
        deleteTeams();
        break;
      default:
        console.log(
          `Error, callback for ${actionOptions[selectedAction].format} not found.`
        );
    }
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
        onClick: () => addItem(isNew),
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

  const addItem = async (isNew) => {
    const {
      data: organizationData,
      status,
    } = await formEditRef.current.submit();
    if (status === 200) {
      dialog.current.close();
      isNew
        ? setData([...data, organizationData])
        : setData(
            data.map((team, i) =>
              team.id === organizationData.id ? organizationData : team
            )
          );
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
      await getData(props.organization.id);
      dialog.current.close();
    }
  };

  const openTeamPage = (id) => {
    router.push(`/organization/${id}`);
  };

  const triggerAlert = ({ message, severity }) => {
    setAlertMesagge({
      message: message,
      severity: severity,
    });
    setOpenAlert(true);
    setTimeout(() => setOpenAlert(false), 3000);
  };

  const removeSelectedRows = () => {
    const filteredTeams = data.filter(
      (team) => selectedTeams.indexOf(team.id) === -1
    );
    setData(filteredTeams);
  };

  const deleteTeams = async () => {
    try {
      const response = await apiETK.post(
        `/organization/${props.organization.id}/teams/bulk_delete`,
        selectedTeams
      );
      if (response.status === 200) {
        triggerAlert({
          message: `${selectedTeams.length} équipes supprimées avec succès.`,
          severity: "success",
        });
        removeSelectedRows();
        setSelectedTeams([]);
      }
    } catch (e) {
      triggerAlert({
        message: "Erreur lors de la supression des équipes",
        severity: "error",
      });
    }
  };

  const discardTeams = async () => {
    try {
      const response = await apiETK.post(
        `/organization/${props.organization.id}/teams/bulk_archive`,
        selectedTeams
      );
      if (response.status === 200) {
        triggerAlert({
          message: `${selectedTeams.length} équipes archivées avec succès.`,
          severity: "success",
        });
        removeSelectedRows();
        setSelectedTeams([]);
      }
    } catch (e) {
      triggerAlert({
        message: "Erreur lors de l'archivage des équipes",
        severity: "error",
      });
    }
  };

  return (
    <Fragment>
      <SnackAlert
        open={openAlert}
        severity={alertMessage.severity}
        message={alertMessage.message}
      />
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
        organizationId={props.organization.id}
        rows={data}
        openArea={openArea}
        openTeamPage={openTeamPage}
        openForm={openForm}
        onSelected={onSelected}
        discardTeams={discardTeams}
        deleteTeams={deleteTeams}
      />
    </Fragment>
  );
};

export default Teams;
