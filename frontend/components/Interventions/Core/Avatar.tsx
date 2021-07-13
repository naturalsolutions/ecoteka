import { FC } from "react";
import { makeStyles, Theme, Avatar } from "@material-ui/core";
import { TIntervention } from "@/components/Interventions/Schema";
import { calculatePriority } from "@/components/Interventions/Provider";

import PruningIcon from "@/public/assets/interventions/intervention-01.svg";
import FellingIcon from "@/public/assets/interventions/intervention-03.svg";
import StreanRemovalIcon from "@/public/assets/interventions/intervention-02.svg";
import IndepthDiagnosticIcon from "@/public/assets/interventions/intervention-14.svg";
import TreatmentIcon from "@/public/assets/interventions/intervention-05.svg";
import SurveillanceIcon from "@/public/assets/interventions/intervention-04.svg";

const useStyles = makeStyles((theme: Theme) => ({
  root: {},
  avatar: {
    padding: 9,
    width: theme.spacing(6),
    height: theme.spacing(6),

    "& path": {
      fill: theme.palette.common.white,
    },
  },
  urgent: {
    backgroundColor: theme.palette.warning.main,
  },
  archived: {
    backgroundColor: theme.palette.grey["300"],
  },
  late: {
    backgroundColor: theme.palette.error.main,
  },
  schedulable: {
    backgroundColor: theme.palette.primary.main,
  },
  done: {
    backgroundColor: theme.palette.success.light,
  },
}));

const INTERVENTION_ICONS = {
  pruning: PruningIcon,
  felling: FellingIcon,
  streanremoval: StreanRemovalIcon,
  indepthdiagnostic: IndepthDiagnosticIcon,
  treatment: TreatmentIcon,
  surveillance: SurveillanceIcon,
};

export interface InterventionAvatarProps {
  intervention: TIntervention;
}

const InterventionAvatar: FC<InterventionAvatarProps> = ({ intervention }) => {
  const classes = useStyles();
  const Icon = INTERVENTION_ICONS[intervention.intervention_type];

  const priority = calculatePriority({
    done: intervention.done,
    start: intervention.intervention_start_date,
    end: intervention.intervention_end_date,
    archived: intervention.properties.cancelled,
  });

  console.log(priority);

  return (
    <Avatar className={[classes.avatar, classes[priority]].join(" ")}>
      <Icon />
    </Avatar>
  );
};

export default InterventionAvatar;
