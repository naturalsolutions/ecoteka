import { FC, useRef } from "react";
import {
  makeStyles,
  Theme,
  Button,
  ButtonProps,
  useTheme,
  useMediaQuery,
} from "@material-ui/core";
import Can from "@/components/Can";
import { useMemberContext } from "./Provider";
import { useAppLayout } from "@/components/AppLayout/Base";
import AddMembers, {
  AddMembersActions,
} from "@/components/Organization/Members/AddMembers";
import { useAppContext } from "@/providers/AppContext";
import { useTranslation } from "react-i18next";
import { Add as AddIcon } from "@material-ui/icons";

export interface AddMembersButtonProps {}

const useStyles = makeStyles((theme: Theme) => ({
  root: {},
  button: {
    margin: theme.spacing(1),
  },
}));

const AddMembersButton: FC<ButtonProps> = ({ size = "" }) => {
  const classes = useStyles();
  const { t } = useTranslation(["components"]);
  const { dialog } = useAppLayout();
  const { organization } = useAppContext();
  const theme = useTheme();
  const isDownSm = useMediaQuery(theme.breakpoints.down("sm"));
  const { fetchOrganizationMembers } = useMemberContext();
  const formAddMembersRef = useRef<AddMembersActions>();

  const closeAddMembersDialog = (refetchOrganizationData: boolean) => {
    if (refetchOrganizationData) {
      fetchOrganizationMembers();
    }

    dialog.current.close();
  };

  function addMember() {
    dialog.current.open({
      title: t("components.Organization.Members.dialog.title"),
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
        fullScreen: isDownSm,
        disableBackdropClick: true,
      },
    });
  }

  return (
    <Can do="create" on="Members">
      <Button
        variant="contained"
        color="primary"
        className={classes.button}
        startIcon={<AddIcon />}
        onClick={addMember}
      >
        {isDownSm
          ? t("common.add")
          : t("components.Organization.Members.addMembers")}
      </Button>
    </Can>
  );
};

export default AddMembersButton;
