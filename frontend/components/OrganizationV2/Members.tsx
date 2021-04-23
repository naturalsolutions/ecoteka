import { FC } from "react";
import {
  makeStyles,
  Theme,
  Grid,
  Button,
  List,
  ListItem,
} from "@material-ui/core";
import CoreOptionsPanel from "../Core/OptionsPanel";

export interface OrganizationMembersProps {}

const useStyles = makeStyles((theme: Theme) => ({
  role: {
    textAlign: "right",
  },
}));

const OrganizationMembers: FC<OrganizationMembersProps> = ({}) => {
  const classes = useStyles();
  const members = [
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

  return (
    <CoreOptionsPanel title={"members"} items={[]}>
      <List>
        {members.map((m) => (
          <ListItem divider button>
            <Grid container>
              <Grid item xs={10}>
                {m.name}
              </Grid>
              <Grid item xs={2} className={classes.role}>
                {m.role}
              </Grid>
            </Grid>
          </ListItem>
        ))}
      </List>
      <Button variant="contained" color="primary" fullWidth>
        liste complète
      </Button>
    </CoreOptionsPanel>
  );
};

export default OrganizationMembers;
