import { FC } from "react";
import { makeStyles, Theme } from "@material-ui/core";
import { useRouter } from "next/router";

export interface TreeInterventionProps {}

const useStyles = makeStyles((theme: Theme) => ({
  root: {},
}));

const TreeIntervention: FC<TreeInterventionProps> = ({}) => {
  const classes = useStyles();
  const router = useRouter();

  return <div>tree intervention: {router.query?.interventionId}</div>;
};

export default TreeIntervention;
