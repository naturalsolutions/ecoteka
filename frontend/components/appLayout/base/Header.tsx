import { FC } from "react";
import { AppBar, Grid, IconButton } from "@material-ui/core";
import Logo from "@/components/Logo";
import OrganizationSelect from "@/components/Organization/Select";
import { useAppContext } from "@/providers/AppContext";
import { IOrganization } from "@/index";
import LanguageSelector from "@/components/LanguageSelector";
import UserMainMenuButton from "@/components/User/MainMenuButton";
import EventIcon from "@material-ui/icons/Event";
import { useRouter } from "next/router";

const AppLayoutHeader: FC<{ className?: string }> = ({ className }) => {
  const { user, setUser } = useAppContext();
  const router = useRouter();

  const handleOrganizationSelectChange = (organization: IOrganization) => {
    if (!organization || !organization.id) {
      return;
    }

    const newUser = { ...user };
    newUser.currentOrganization = organization;
    setUser(newUser);
  };

  return (
    <AppBar color="secondary" position="fixed" className={className}>
      <Grid
        container
        alignItems="center"
        style={{ height: "100%", padding: "0px 1rem" }}
      >
        <Logo />
        {user && (
          <Grid item>
            <OrganizationSelect
              user={user}
              onChange={handleOrganizationSelectChange}
            />
          </Grid>
        )}
        <Grid item xs />
        <Grid item>
          <Grid
            container
            spacing={2}
            justify="center"
            alignContent="center"
            alignItems="center"
          >
            <Grid item>
              <IconButton
                onClick={() => {
                  router.push("/scheduler");
                }}
              >
                <EventIcon />
              </IconButton>
            </Grid>
            <Grid item>
              <LanguageSelector />
            </Grid>
            <Grid item>
              <UserMainMenuButton user={user} />
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </AppBar>
  );
};

export default AppLayoutHeader;
