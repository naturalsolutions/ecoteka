import { FC } from "react";
import { makeStyles, Theme, LinearProgress } from "@material-ui/core";

export interface OrganizationLoadingProgressProps {}

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    width: "100%",
  },
}));

const OrganizationLoadingProgress: FC<OrganizationLoadingProgressProps> =
  ({}) => {
    const classes = useStyles();

    return (
      <div className={classes.root}>
        <LinearProgress />
      </div>
    );
  };

export default OrganizationLoadingProgress;
