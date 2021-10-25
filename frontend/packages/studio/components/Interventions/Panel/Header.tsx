import React, { FC } from "react";
import {
  makeStyles,
  Theme,
  Grid,
  ListItemText,
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Button,
} from "@material-ui/core";
import Avatar from "@/components/Interventions/Core/Avatar";

import { TIntervention } from "@/components/Interventions/Schema";
import { useTranslation } from "react-i18next";

export interface InterventionPanelHeaderProps {
  intervention: TIntervention;
  secondaryActions?: React.ReactElement;
}

const useStyles = makeStyles((theme: Theme) => ({
  root: {},
  title: {
    flexGrow: 1,
    padding: theme.spacing(1),
  },
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
    intervention.done && !intervention.properties.cancelled && intervention.date
      ? `Réalisée le ${new Date(intervention.date).toLocaleDateString()}`
      : "";
  const periodDate =
    !intervention.done &&
    !intervention.properties.cancelled &&
    intervention.intervention_start_date
      ? `Prévue pour le ${new Date(
          intervention.intervention_start_date
        )?.toLocaleDateString()}`
      : "";

  const cancelDate =
    intervention.properties.cancelled && intervention.properties.cancelledAt
      ? `Annulée le ${new Date(
          intervention.properties.cancelledAt
        )?.toLocaleDateString()}`
      : "";

  return (
    <AppBar position="static" color="transparent">
      <Toolbar>
        <Avatar intervention={intervention} />
        <Typography variant="h6" component="div" className={classes.title}>
          <ListItemText
            primary={interventionNames[intervention.intervention_type]}
            secondary={date || periodDate || cancelDate}
          />
        </Typography>
        {secondaryActions}
      </Toolbar>
    </AppBar>
  );
};

export default InterventionPanelHeader;
