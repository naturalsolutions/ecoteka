import { FC, Fragment, useState, useRef, useEffect } from "react";
import { IOrganization } from "@/index.d";
import { makeStyles } from "@material-ui/core/styles";
import { Box, Button, Toolbar, useMediaQuery } from "@material-ui/core";
import { Block as BlockIcon, Add as AddIcon } from "@material-ui/icons";
import { useAppLayout } from "@/components/AppLayout/Base";
import { useTranslation } from "react-i18next";
import { apiRest } from "@/lib/api";
import useAPI from "@/lib/useApi";
import { useThemeContext } from "@/lib/hooks/useThemeSwitcher";
import AddMembers, {
  AddMembersActions,
} from "@/components/Organization/Members/AddMembers";
import MembersTable from "@/components/Organization/Members/MembersTable";

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

const Members: FC<MembersProps> = ({ organization }) => {
  const classes = useStyles();
  const { theme } = useThemeContext();
  const { dialog, snackbar } = useAppLayout();
  const { api } = useAPI();
  const { apiETK } = api;
  const matches = useMediaQuery(theme.breakpoints.down("md"));
  const { t } = useTranslation(["components", "common"]);
  const formAddMembersRef = useRef<AddMembersActions>();
  const [disableActions, setDisableActions] = useState(true);
  const [selectedMembers, setSelectedMembers] = useState([]);
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
    getData(organization.id);
  }, [organization]);

  const onDetachMembers = () => {
    selectedMembers.map(async (id) => {
      try {
        await apiRest.organization.detachMember(organization.id, id);
        await getData(organization.id);
      } catch (e) {
        snackbar.current.open({
          message: `Une erreur est survenue... votre action n'a pas pu être traitée.`,
          severity: "error",
        });
      }
    });
    dialog.current.close();
  };

  function addMember() {
    const dialogActions = [
      {
        label: t("components:Organization.Members.done"),
      },
      {
        label: t("common:buttons.send"),
        variant: "contained",
        color: "secondary",
        noClose: true,
        onClick: inviteMembers,
      },
    ];

    dialog.current.open({
      title: t("components:Organization.Members.dialogAddMemberTitle"),
      content: (
        <AddMembers ref={formAddMembersRef} organizationID={organization.id} />
      ),
      actions: dialogActions,
      dialogProps: {
        maxWidth: "sm",
        fullWidth: true,
        fullScreen: matches,
        disableBackdropClick: true,
      },
    });
  }

  const inviteMembers = async () => {
    const response = await formAddMembersRef.current.submit();

    if (response.ok) {
      dialog.current.close();
      await getData(organization.id);
    }
  };

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
      content: <div>Action irréversible!</div>,
      actions: dialogActions,
      dialogProps: {
        maxWidth: "sm",
        fullWidth: true,
        fullScreen: matches,
        disableBackdropClick: true,
      },
    });
  }

  const onSelected = (selection) => {
    setSelectedMembers(selection);
  };

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
          rows={data}
          onSelected={onSelected}
          onDetachMembers={detachMembers}
        />
      )}
    </Fragment>
  );
};

export default Members;
