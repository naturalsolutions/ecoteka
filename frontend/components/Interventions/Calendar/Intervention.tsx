import React from "react";
import { TIntervention } from "@/components/Interventions/Schema";
import { INTERVENTION_COLORS } from "@/components/Interventions/constants";
import { useRouter } from "next/router";

export interface CalendarInterventionProps {
  intervention: TIntervention;
  onSave?(intervention: TIntervention): void;
}

const defaultProps: CalendarInterventionProps = {
  intervention: undefined,
};

const CalendarIntervention: React.FC<CalendarInterventionProps> = ({
  intervention,
}) => {
  const router = useRouter();
  const backgroundColor = INTERVENTION_COLORS[intervention.intervention_type];

  const handleOnClick = () => {
    router.push({
      pathname: "/map",
      query: {
        panel: "intervention-edit",
        intervention: intervention.id,
        tree: intervention.tree_id,
      },
    });
  };

  return (
    <div
      onClick={handleOnClick}
      style={{
        borderRadius: "50%",
        backgroundColor: backgroundColor,
        width: "10px",
        height: "10px",
        marginRight: "2px",
      }}
    />
  );
};

CalendarIntervention.defaultProps = defaultProps;

export default CalendarIntervention;
