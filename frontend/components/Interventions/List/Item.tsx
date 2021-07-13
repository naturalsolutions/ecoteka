import { FC } from "react";
import {
  ListItem,
  ListItemAvatar,
  ListItemText,
  ListItemSecondaryAction,
  Checkbox,
  Divider,
} from "@material-ui/core";
import { TIntervention } from "@/components/Interventions/Schema";
import { useTranslation } from "react-i18next";
import { useAppContext } from "@/providers/AppContext";
import { useRouter } from "next/router";
import { useInterventionContext } from "@/components/Interventions/Provider";
import InterventionAvatar from "@/components/Interventions/Core/Avatar";

export interface InterventionsListItemProps {
  intervention: TIntervention;
  selectable?: boolean;
  withDivider?: boolean;
  dense?: boolean;
  SecondaryActions?: React.ReactElement;
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

const InterventionsListItem: FC<InterventionsListItemProps> = ({
  intervention,
  selectable = true,
}) => {
  const { t } = useTranslation();
  const { organization } = useAppContext();
  const router = useRouter();
  const { interventionSelected, setInterventionSelected } =
    useInterventionContext();
  const interventionNames = t("components.Intervention.types", {
    returnObjects: true,
  });

  const date =
    intervention.done && intervention.date
      ? `Réalisée le ${new Date(intervention.date).toLocaleDateString()}`
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
          <InterventionAvatar intervention={intervention} />
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
