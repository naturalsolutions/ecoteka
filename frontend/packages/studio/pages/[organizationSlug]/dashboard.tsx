import { FC } from "react";
import { makeStyles, Theme } from "@material-ui/core";
import WorkInProgress from "@/components/WorkInProgress";

export interface DashboardProps {}

const useStyles = makeStyles((theme: Theme) => ({
  root: {},
}));

const Dashboard: FC<DashboardProps> = ({}) => {
  const classes = useStyles();

  return <WorkInProgress />;
};

export default Dashboard;
