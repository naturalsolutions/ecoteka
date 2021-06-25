import { FC, useState } from "react";
import {
  makeStyles,
  Theme,
  Avatar,
  ListItem,
  ListItemAvatar,
  ListItemText,
  ListItemSecondaryAction,
  Checkbox,
  Divider,
} from "@material-ui/core";
import { TIntervention } from "@/components/Interventions/Schema";
import PruningIcon from "@/public/assets/interventions/intervention-01.svg";
import FellingIcon from "@/public/assets/interventions/intervention-02.svg";
import StreanRemovalIcon from "@/public/assets/interventions/intervention-03.svg";
import IndepthDiagnosticIcon from "@/public/assets/interventions/intervention-04.svg";
import TreatmentIcon from "@/public/assets/interventions/intervention-05.svg";
import SurveillanceIcon from "@/public/assets/interventions/intervention-06.svg";
import { useInterventionContext } from "../Provider";
import { useTranslation } from "react-i18next";
import { isAfter } from "date-fns";
import { useAppContext } from "@/providers/AppContext";
import { useRouter } from "next/router";

export interface InterventionsListItemProps {
  intervention: TIntervention;
  selectable?: boolean;
}

/**
 * InterventionState
 *
 * urgent -> !done && intervention.intervention_start_date < 2 weeks
 * late -> !done && >intervention.intervention_end_date
 * done -> done
 * archived -> archived
 * schedulable -> !urgent && !late && !done
 */

export type InterventionState =
  | "done"
  | "archive"
  | "late"
  | "urgent"
  | "schedulable";

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

const calculatePriority = ({ done, archived, start, end }) => {
  const now = new Date();
  const twoWeeks = new Date();
  const oneDay = 1000 * 3600 * 24;

  twoWeeks.setTime(twoWeeks.getTime() - 15 * oneDay);

  const differenceInDays = Math.abs(now.getTime() - new Date(start).getTime());
  const distance = Math.floor(differenceInDays / oneDay);

  if (done) {
    return "done";
  }

  if (archived) {
    return "archived";
  }

  if (!done && end < now) {
    return "late";
  }

  if (!done && distance <= 15) {
    return "urgent";
  }

  return "schedulable";
};

const InterventionsListItem: FC<InterventionsListItemProps> = ({
  intervention,
  selectable = true,
}) => {
  const classes = useStyles();
  const { t } = useTranslation();
  const Icon = INTERVENTION_ICONS[intervention.intervention_type];
  const { organization } = useAppContext();
  const router = useRouter();
  const { interventionSelected, setInterventionSelected } =
    useInterventionContext();
  const interventionNames = t("components.Intervention.types", {
    returnObjects: true,
  });

  const date =
    intervention.done && intervention.date
      ? `Réalisée le ${intervention.date.toLocaleDateString()}`
      : "";
  const periodDate =
    !intervention.done &&
    intervention.intervention_start_date &&
    intervention.intervention_end_date
      ? `Entre le ${new Date(
          intervention.intervention_start_date
        )?.toLocaleDateString()} et ${new Date(
          intervention.intervention_end_date
        )?.toLocaleDateString()} `
      : "";

  const priority = calculatePriority({
    done: intervention.done,
    start: intervention.intervention_start_date,
    end: intervention.intervention_end_date,
    archived: false,
  });

  const handleShowIntervention = () => {
    router.push({
      pathname: "/[organizationSlug]/map",
      query: {
        panel: "intervention-edit",
        intervention: intervention.id,
        tree: intervention.tree_id,
        organizationSlug: organization.slug,
      },
    });
  };

  const handleToggle = (value) => () => {
    const currentIndex = interventionSelected.indexOf(value);
    const newInterventionSelected = [...interventionSelected];

    if (currentIndex === -1) {
      newInterventionSelected.push(value);
    } else {
      newInterventionSelected.splice(currentIndex, 1);
    }

    setInterventionSelected(newInterventionSelected);
  };

  return (
    <>
      <ListItem button onClick={handleShowIntervention}>
        <ListItemAvatar>
          <Avatar className={[classes.avatar, classes[priority]].join(" ")}>
            <Icon />
          </Avatar>
        </ListItemAvatar>
        <ListItemText
          primary={interventionNames[intervention.intervention_type]}
          secondary={date || periodDate}
        />
        {selectable && (
          <ListItemSecondaryAction>
            <Checkbox
              onClick={handleToggle(intervention.id)}
              edge="end"
              checked={interventionSelected.indexOf(intervention.id) !== -1}
              tabIndex={-1}
              disableRipple
              inputProps={{ "aria-labelledby": intervention.intervention_type }}
            />
          </ListItemSecondaryAction>
        )}
      </ListItem>
      <Divider component="li" />
    </>
  );
};

export default InterventionsListItem;
