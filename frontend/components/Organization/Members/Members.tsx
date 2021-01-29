import { FC, Fragment, useState, useRef, useEffect } from "react";
import { IOrganization } from "@/index.d";
import { makeStyles } from "@material-ui/core/styles";
import { Box, Button, Toolbar, useMediaQuery } from "@material-ui/core";
import { Block as BlockIcon, Add as AddIcon } from "@material-ui/icons";
import { Alert, AlertTitle } from "@material-ui/lab";
import { useAppLayout } from "@/components/AppLayout/Base";
import { useTranslation } from "react-i18next";
import { useSnackbar } from "notistack";
import useAPI from "@/lib/useApi";
import { useThemeContext } from "@/lib/hooks/useThemeSwitcher";
import AddMembers, {
  AddMembersActions,
} from "@/components/Organization/Members/AddMembers";
import MembersTable from "@/components/Organization/Members/MembersTable";
import { IMember } from "@/index";

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
interface MembersProps {
  organization: IOrganization;
  value: string | string[];
  index: string;
}

const ConfirmAlertMessage = (props) => {
  const { t } = useTranslation(["components", "common"]);
  return (
    <Box my={1}>
      <Alert severity="warning">
        <AlertTitle>
          {t("components:Organization.Members.onDetach.dialog.alertTitle")}
        </AlertTitle>
        {t("components:Organization.Members.onDetach.dialog.alertContent1")}
        <p>
          <strong>
            {t("components:Organization.Members.onDetach.dialog.alertContent2")}
          </strong>
        </p>
      </Alert>
    </Box>
  );
};

const Members: FC<MembersProps> = ({ organization }) => {
  const classes = useStyles();
  const { theme } = useThemeContext();
  const { dialog, snackbar } = useAppLayout();
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const { api } = useAPI();
  const { apiETK } = api;
  const matches = useMediaQuery(theme.breakpoints.down("md"));
  const { t } = useTranslation(["components", "common"]);
  const formAddMembersRef = useRef<AddMembersActions>();
  const [disableActions, setDisableActions] = useState(true);
  const [selectedMembers, setSelectedMembers] = useState<IMember[]>([]);
  const [data, setData] = useState([]);

  const getData = async (organizationId: number) => {
    try {
      const { data, status } = await apiETK.get(
        `/organization/${organizationId}/members`
      );
      if (status === 200) {
        setData(data);
      }
    } catch (e) {}
  };

  useEffect(() => {
    setDisableActions(Boolean(selectedMembers.length == 0));
  }, [selectedMembers]);

  useEffect(() => {
    console.table(data);
  }, [data]);

  useEffect(() => {
    getData(organization.id);
  }, [organization]);

  const removeSelectedRows = () => {
    const filteredMembers = data.filter(
      (member) => selectedMembers.indexOf(member.id) === -1
    );
    setData(filteredMembers);
  };

  const onDetachMembers = () => {
    selectedMembers.map(async (member, index) => {
      // This happens to fast and lead to "sqlalchemy.exc.InvalidRequestError: This session is in 'prepared' state; no further SQL can be emitted within this transaction"
      // Add bulk_remove_members in backend
      setTimeout(async () => {
        try {
          const { status, data: memberData } = await apiETK.delete(
            `/organization/${organization.id}/members/${member.id}`
          );
          if (status === 200) {
            enqueueSnackbar(
              `${member.email} ${t(
                "components:Organization.Members.onDetach.success"
              )}`,
              {
                variant: "success",
              }
            );
            setData((prev) => {
              const newData = prev.filter((row) => row.id !== member.id);
              return newData;
            });
          }
          if (status !== 200) {
            enqueueSnackbar(
              `${t("components:Organization.Members.onDetach.errorAlert")}. ${
                member.email
              } ${t("components:Organization.Members.onDetach.errorContent")}`,
              {
                variant: "error",
              }
            );
          }
        } catch (e) {
          enqueueSnackbar(`Error`, {
            variant: "error",
          });
        }
      }, 400 * index);
    });
    setSelectedMembers([]);
    dialog.current.close();
  };

  const onSelected = (selection) => {
    setSelectedMembers(selection);
  };

  const onMemberUpdate = (updatedMember: IMember) => {
    setData(
      data.map((member, i) =>
        member.id === updatedMember.id ? updatedMember : member
      )
    );
  };

  const closeAddMembersDialog = (refetchOrganizationData: boolean) => {
    if (refetchOrganizationData) {
      getData(organization.id);
    }

    dialog.current.close();
  };

  function addMember() {
    dialog.current.open({
      title: t("components:Organization.Members.dialog.title"),
      content: (
        <AddMembers
          ref={formAddMembersRef}
          organizationId={organization.id}
          closeAddMembersDialog={closeAddMembersDialog}
        />
      ),
      dialogProps: {
        maxWidth: "sm",
        fullWidth: true,
        fullScreen: matches,
        disableBackdropClick: true,
      },
    });
  }

  function detachMembers() {
    const dialogActions = [
      {
        label: t("components:Organization.Members.cancel"),
      },
      {
        label: t("components:Organization.Members.confirmDetach"),
        variant: "contained",
        color: "primary",
        noClose: true,
        onClick: onDetachMembers,
      },
    ];

    dialog.current.open({
      title: t("components:Organization.Members.dialogDdetachMembersTitle"),
      content: <ConfirmAlertMessage />,
      actions: dialogActions,
      dialogProps: {
        maxWidth: "sm",
        fullWidth: true,
        fullScreen: matches,
        disableBackdropClick: true,
      },
    });
  }

  return (
    <Fragment>
      <Toolbar className={classes.toolbar}>
        <Box className={classes.root} />
        <Button
          variant="contained"
          size="small"
          disabled={disableActions}
          color="secondary"
          className={classes.button}
          startIcon={<BlockIcon />}
          onClick={detachMembers}
        >
          {t("components:Organization.Members.detachMembers")}
        </Button>
        <Button
          variant="contained"
          size="small"
          color="primary"
          className={classes.button}
          startIcon={<AddIcon />}
          onClick={addMember}
        >
          {t("components:Organization.Members.addMembers")}
        </Button>
      </Toolbar>
      {data && (
        <MembersTable
          organizationId={organization.id}
          rows={data}
          selectedMembers={selectedMembers}
          onSelected={onSelected}
          onDetachMembers={detachMembers}
          onMemberUpdate={onMemberUpdate}
        />
      )}
    </Fragment>
  );
};

export default Members;
