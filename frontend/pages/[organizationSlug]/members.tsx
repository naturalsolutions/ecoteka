import AppLayoutGeneral from "@/components/AppLayout/General";
import MemberItem from "@/components/Member/Item";
import MemberList from "@/components/Member/List";
import { IMember } from "@/index";
import useApi from "@/lib/useApi";
import { useAppContext } from "@/providers/AppContext";
import { Container, makeStyles } from "@material-ui/core";
import { FC, useEffect, useState } from "react";

const useStyles = makeStyles((theme) => ({
  container: {
    [theme.breakpoints.down("sm")]: {
      padding: 0,
    },
  },
}));

const OrganizationMembers: FC = () => {
  const { organization } = useAppContext();
  const [members, setMembers] = useState<IMember[]>([]);
  const { apiETK } = useApi().api;
  const classes = useStyles();

  const fetchMembers = async (organizationId: number) => {
    try {
      const { status, data } = await apiETK.get(
        `/organization/${organizationId}/members`
      );

      if (status === 200) {
        setMembers(data);
      }
    } catch (error) {}
  };

  useEffect(() => {
    fetchMembers(organization.id);
  }, []);

  const renderMembers = (members: IMember[]) => {
    return (
      <MemberList>
        {members.map((member) => (
          <MemberItem member={member} />
        ))}
      </MemberList>
    );
  };

  return (
    <AppLayoutGeneral>
      <Container className={classes.container}>
        {renderMembers(members)}
      </Container>
    </AppLayoutGeneral>
  );
};

export default OrganizationMembers;
