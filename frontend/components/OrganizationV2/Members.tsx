import { FC, useEffect, useRef, useState } from "react";
import {
  makeStyles,
  Theme,
  Grid,
  Button,
  List,
  ListItem,
  useMediaQuery,
} from "@material-ui/core";
import { Block as BlockIcon, Add as AddIcon } from "@material-ui/icons";
import CoreOptionsPanel from "../Core/OptionsPanel";
import { useAppContext } from "@/providers/AppContext";
import useApi from "@/lib/useApi";
import { useAppLayout } from "../AppLayout/Base";
import { useTranslation } from "react-i18next";
import AddMembers, {
  AddMembersActions,
} from "@/components/Organization/Members/AddMembers";
import Can from "@/components/Can";
import { useThemeContext } from "@/lib/hooks/useThemeSwitcher";

export interface OrganizationMembersProps {}

const useStyles = makeStyles((theme: Theme) => ({
  role: {
    textAlign: "right",
  },
  button: {
    margin: theme.spacing(1),
  },
}));

const OrganizationMembers: FC<OrganizationMembersProps> = ({}) => {
  const classes = useStyles();
  const { dialog, snackbar } = useAppLayout();
  const { t } = useTranslation(["components", "common"]);
  const { organization } = useAppContext();
  const { apiETK } = useApi().api;
  const [members, setMembers] = useState([]);
  const formAddMembersRef = useRef<AddMembersActions>();
  const { theme } = useThemeContext();
  const matches = useMediaQuery(theme.breakpoints.down("md"));

  const mockMembers = [
    {
      name: "Martine Lucette",
      role: "Admin",
    },
    {
      name: "Pedro Delavega",
      role: "Utilisateur",
    },
    {
      name: "Hans Zferingebueygfrbtblu",
      role: "Utilisateur",
    },
    {
      name: "Mamadi Doukouré",
      role: "Admin",
    },
  ];

  const fetchMembers = async (organizationId: number) => {
    try {
      const { data, status } = await apiETK.get(
        `/organization/${organizationId}/members`
      );
      if (status === 200) {
        setMembers(data);
      }
    } catch (e) {}
  };

  const closeAddMembersDialog = (refetchOrganizationData: boolean) => {
    if (refetchOrganizationData) {
      fetchMembers(organization.id);
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
        fullScreen: matches,
        disableBackdropClick: true,
      },
    });
  }

  useEffect(() => {
    if (organization) {
      fetchMembers(organization?.id);
    }
  }, [organization]);

  useEffect(() => {
    console.log(members);
  }, [members]);

  return (
    <CoreOptionsPanel
      title={"members"}
      items={[
        { title: "Gestion des membres", href: `/${organization.slug}/members` },
      ]}
    >
      <List>
        {members.length > 0 &&
          members.map((m) => (
            <ListItem divider button key={`members-${m.id}`}>
              <Grid container>
                <Grid item xs={10}>
                  {m.full_name}
                </Grid>
                <Grid item xs={2} className={classes.role}>
                  {m.role}
                </Grid>
              </Grid>
            </ListItem>
          ))}
      </List>
      <Can do="create" on="Members">
        <Button
          variant="contained"
          size="small"
          color="primary"
          className={classes.button}
          startIcon={<AddIcon />}
          onClick={addMember}
        >
          {t("components.Organization.Members.addMembers")}
        </Button>
      </Can>
    </CoreOptionsPanel>
  );
};

export default OrganizationMembers;
