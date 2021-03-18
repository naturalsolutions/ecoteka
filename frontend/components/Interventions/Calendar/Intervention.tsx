import React from "react";
import { TIntervention } from "@/components/Interventions/Schema";
import { INTERVENTION_COLORS } from "@/components/Interventions/constants";
import { useRouter } from "next/router";
import { useAppContext } from "@/providers/AppContext";

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
  const { organization } = useAppContext();

  const handleOnClick = () => {
    router.push({
      pathname: "/[organizationSlug]/map",
      query: {
        panel: "intervention-edit",
        organizationSlug: organization.id,
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
