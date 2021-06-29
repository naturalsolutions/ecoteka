import { FC } from "react";
import { makeStyles, Theme, Grid, useTheme, Button } from "@material-ui/core";
import { useMemberContext } from "@/components/Members/Provider";
import MembersListContainer from "@/components/Members/List/Container";
import MembersListItem from "@/components/Members/List/Item";
import { useMeasure } from "react-use";
import { useRouter } from "next/router";
import { useAppContext } from "@/providers/AppContext";

export interface MembersManagementProps {
  selectable?: boolean;
  showAllMembers?: boolean;
}

const useStyles = makeStyles((theme: Theme) => ({
  root: {},
}));

const MembersManagement: FC<MembersManagementProps> = ({
  selectable = true,
  showAllMembers = true,
}) => {
  const classes = useStyles();
  const { organizationMembers } = useMemberContext();
  const [ref, measure] = useMeasure();
  const theme = useTheme();

  const isMobile = measure.width <= theme.breakpoints.values.sm;

  return (
    <Grid ref={ref} container spacing={2}>
      <Grid item xs>
        <MembersListContainer label={`Membres (${organizationMembers.length})`}>
          {organizationMembers?.map((member) => (
            <MembersListItem
              key={`member-${member.id}`}
              selectable={selectable}
              member={member}
            />
          ))}
        </MembersListContainer>
      </Grid>
    </Grid>
  );
};

export default MembersManagement;
