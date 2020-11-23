import React, { useState } from "react";
import {
  makeStyles,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Checkbox,
  FormLabel,
} from "@material-ui/core";
import {
  interventionTypes,
  TInterventionType,
} from "@/components/Interventions/Schema";
import { useTranslation } from "react-i18next";

export interface CalendarFilterProps {
  interventionColors?: {};
}

const defaultProps: CalendarFilterProps = {};

const useStyles = makeStyles(() => ({
  root: {},
}));

const CalendarFilter: React.FC<CalendarFilterProps> = (props) => {
  const classes = useStyles();
  const [types, setItypes] = useState(interventionTypes);
  const { t } = useTranslation(["common", "components"]);

  const handleCheckboxChange = (e, it: TInterventionType) => {
    const value = e.target.checked;

    if (value) {
      return setItypes(types.concat([it]));
    }

    setItypes(types.filter((i) => i !== it));
  };

  return (
    <List dense>
      {interventionTypes.map((it) => (
        <ListItem key={`list-item-${it}`} dense button>
          <ListItemIcon>
            <Checkbox
              style={{ color: props.interventionColors[it] }}
              checked={types.includes(it)}
              id={`checkbox-for-${it}`}
              onChange={(e) => handleCheckboxChange(e, it)}
            />
          </ListItemIcon>
          <ListItemText primary={t(`components:Intervention.types.${it}`)} />
        </ListItem>
      ))}
    </List>
  );
};

CalendarFilter.defaultProps = defaultProps;

export default CalendarFilter;
