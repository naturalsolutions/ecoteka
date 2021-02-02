import React, { useEffect, useState } from "react";
import {
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Checkbox,
} from "@material-ui/core";
import {
  interventionTypes,
  TInterventionType,
} from "@/components/Interventions/Schema";
import { useTranslation } from "react-i18next";
import { INTERVENTION_COLORS } from "@/components/Interventions/Calendar/index.d";

export interface CalendarFilterProps {
  onChange(filters: object): void;
}

const CalendarFilter: React.FC<CalendarFilterProps> = (props) => {
  const initialData = interventionTypes.reduce(
    (oldInterventinType, newInterventionType) =>
      Object.assign(oldInterventinType, {
        [newInterventionType]: true,
      }),
    {}
  );
  const [filters, setFilters] = useState(initialData);
  const { t } = useTranslation(["common", "components"]);

  const handleCheckboxChange = (e, interventionType: TInterventionType) => {
    setFilters({ ...filters, [interventionType]: e.target.checked });
  };

  useEffect(() => {
    props.onChange(Object.keys(filters).filter((filter) => filters[filter]));
  }, [filters]);

  return (
    <List dense>
      {interventionTypes.map((interventionType) => (
        <ListItem key={`list-item-${interventionType}`} dense button>
          <ListItemIcon>
            <Checkbox
              style={{ color: INTERVENTION_COLORS[interventionType] }}
              checked={filters[interventionType]}
              id={`checkbox-for-${interventionType}`}
              onChange={(e) => handleCheckboxChange(e, interventionType)}
            />
          </ListItemIcon>
          <ListItemText
            primary={t(`components.Intervention.types.${interventionType}`)}
          />
        </ListItem>
      ))}
    </List>
  );
};

export default CalendarFilter;
