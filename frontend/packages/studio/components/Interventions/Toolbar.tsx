import { FC } from "react";
import {
  makeStyles,
  Theme,
  Button,
  useMediaQuery,
  useTheme,
} from "@material-ui/core";
import ArrowBackIcon from "@material-ui/icons/ArrowBack";
import ArchiveIcon from "@material-ui/icons/Archive";
import AddIcon from "@material-ui/icons/Add";
import DeleteIcon from "@material-ui/icons/Delete";
import { useInterventionContext } from "./Provider";
import { useRouter } from "next/router";
import { useAppContext } from "@/providers/AppContext";
import { useTreeContext } from "../Tree/Provider";

export interface InterventionsToolbarProps {}

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    display: "flex",
    gap: "10px",
    marginBottom: "10px",
  },
  left: {
    display: "flex",
    flex: 1,
    gap: "10px",
  },
  right: {
    display: "flex",
    justifyContent: "flex-end",
    flex: 1,
    gap: "10px",
  },
}));

const InterventionsToolbar: FC<InterventionsToolbarProps> = ({}) => {
  const classes = useStyles();
  const theme = useTheme();
  const isBreakpointSM = useMediaQuery(theme.breakpoints.down("sm"));
  const { interventionSelected } = useInterventionContext();
  const hasInterventionSelected = Boolean(interventionSelected.length);
  const router = useRouter();
  const { organization } = useAppContext();
  const { tree } = useTreeContext();

  const handleGoBack = () => {
    router.back();
  };

  const handleNewIntervention = () => {
    router.push({
      pathname: "/[organizationSlug]/map",
      query: {
        panel: "intervention",
        tree: tree.id,
        organizationSlug: organization.slug,
      },
    });
  };

  return (
    <div className={classes.root}>
      <div className={classes.left}>
        <Button variant="outlined" color="primary" onClick={handleGoBack}>
          <ArrowBackIcon /> {isBreakpointSM ? null : "Retour"}
        </Button>
      </div>
      <div className={classes.right}>
        {hasInterventionSelected && (
          <>
            <Button variant="outlined" color="primary">
              <ArchiveIcon /> {isBreakpointSM ? null : "Archives"}
            </Button>
            <Button variant="outlined" color="primary">
              <DeleteIcon />
            </Button>
          </>
        )}
        {tree && (
          <Button
            variant="contained"
            color="primary"
            onClick={handleNewIntervention}
          >
            <AddIcon />{" "}
            {isBreakpointSM ? "Ajouter" : "Ajouter une intervention"}
          </Button>
        )}
      </div>
    </div>
  );
};

export default InterventionsToolbar;
