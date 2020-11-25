import { FC, Fragment, useState, useRef, useEffect } from "react";
import { IOrganization } from "@/index.d";
import { useQuery, useQueryCache } from "react-query";
import { makeStyles } from "@material-ui/core/styles";
import { apiRest } from "@/lib/api";
import { Box, Button, Toolbar, useMediaQuery } from "@material-ui/core";
import { Block as BlockIcon, Add as AddIcon } from "@material-ui/icons";
import { useTemplate } from "@/components/Template";
import { useTranslation } from "react-i18next";
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

const Members: FC<MembersProps> = ({ organization, value, index }) => {
  const classes = useStyles();
  const { dialog, theme } = useTemplate();
  const matches = useMediaQuery(theme.breakpoints.down("md"));
  const { t } = useTranslation(["components", "common"]);
  const formAddMembersRef = useRef<AddMembersActions>();
  const cache = useQueryCache();
  const { data } = useQuery(
    `members_${organization.id}`,
    async () => {
      const data = await apiRest.organization.members(organization.id);
      return data;
    },
    {
      enabled: Boolean(organization),
    }
  );

  const [enableActions, setEnableActions] = useState(true);

  function onDetachMembers() {
    alert("Confirm detachMembers");
  }

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
    const res = await formAddMembersRef.current.submit();
    if (res.ok) {
      dialog.current.close();
      cache.invalidateQueries(`members_${organization.id}`);
    } else {
      // TODO: useAlert() with status and statusText
    }
  };

  function detachMembers() {
    const dialogActions = [
      {
        label: t("components:Organization.Members.cancel"),
      },
      {
        label: t("components:Contact.confirm"),
        variant: "contained",
        color: "error",
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

  return (
    <Fragment>
      <Toolbar className={classes.toolbar}>
        <Box className={classes.root} />
        <Button
          variant="contained"
          size="small"
          disabled={enableActions}
          color="secondary"
          className={classes.button}
          startIcon={<BlockIcon />}
          onClick={detachMembers}
        >
          Retirer du groupe
        </Button>
        <Button
          variant="contained"
          size="small"
          color="primary"
          className={classes.button}
          startIcon={<AddIcon />}
          onClick={addMember}
        >
          Ajouter des membres
        </Button>
      </Toolbar>
      {data && <MembersTable rows={data} />}
    </Fragment>
  );
};

export default Members;
