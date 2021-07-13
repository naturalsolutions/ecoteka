import React, { FC } from "react";
import { makeStyles, Theme, Grid, ListItemText } from "@material-ui/core";
import Avatar from "@/components/Interventions/Core/Avatar";
import { TIntervention } from "@/components/Interventions/Schema";
import { useTranslation } from "react-i18next";
import { Fragment } from "react";

export interface InterventionPanelHeaderProps {
  intervention: TIntervention;
  secondaryActions?: React.ReactElement;
}

const useStyles = makeStyles((theme: Theme) => ({
  root: {},
}));

const InterventionPanelHeader: FC<InterventionPanelHeaderProps> = ({
  intervention,
  secondaryActions,
}) => {
  const classes = useStyles();
  const { t } = useTranslation();
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
      ? `Prévue pour le ${new Date(
          intervention.intervention_start_date
        )?.toLocaleDateString()}`
      : "";

  return (
    <Grid container spacing={2} alignItems="center">
      <Grid item>
        <Avatar intervention={intervention} />
      </Grid>
      <Grid item>
        <ListItemText
          primary={interventionNames[intervention.intervention_type]}
          secondary={date || periodDate}
        />
      </Grid>
      {secondaryActions && (
        <Fragment>
          <Grid item>{secondaryActions}</Grid>
        </Fragment>
      )}
    </Grid>
  );
};

export default InterventionPanelHeader;
