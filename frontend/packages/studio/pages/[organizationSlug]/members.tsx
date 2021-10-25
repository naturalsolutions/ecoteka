import AppLayoutGeneral from "@/components/AppLayout/General";
import { Container, makeStyles } from "@material-ui/core";
import { FC } from "react";
import MemberProvider from "@/components/Members/Provider";
import MembersToolbar from "@/components/Members/Toolbar";
import MembersManagement from "@/components/Members/Management";

const useStyles = makeStyles((theme) => ({
  container: {
    [theme.breakpoints.down("sm")]: {
      padding: 0,
    },
  },
}));

const OrganizationMembers: FC = () => {
  const classes = useStyles();
  return (
    <MemberProvider>
      <AppLayoutGeneral>
        <Container>
          <MembersToolbar />
          <MembersManagement />
        </Container>
      </AppLayoutGeneral>
    </MemberProvider>
  );
};

export default OrganizationMembers;
