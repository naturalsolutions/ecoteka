import { createContext, FC, useContext, useState } from "react";
import { AxiosInstance } from "axios";
import useApi from "@/lib/useApi";
import { TIntervention } from "@/components/Interventions/Schema";

export const InterventionContext = createContext({} as any);

export interface InterventionProviderProps {
  organizationSlug?: string;
}

export const useInterventionContext = () => useContext(InterventionContext);

const InterventionProvider: FC<InterventionProviderProps> = ({
  organizationSlug,
  children,
}) => {
  const [intervention, setIntervention] = useState<TIntervention>();
  const [organizationInterventions, setOrganizationInterventions] = useState<
    TIntervention[]
  >([]);
  const [interventionSelected, setInterventionSelected] = useState<
    TIntervention[]
  >([]);
  const [scheduledInterventions, setScheduledInterventions] = useState<
    TIntervention[]
  >([
    {
      id: 1,
      done: false,
      estimated_cost: 0,
      intervenant: "Javi",
      intervention_type: "felling",
      tree_id: 1,
      properties: {},
      required_documents: [],
      required_material: [],
      intervention_start_date: new Date("Fri Jun 29 2021 13:49:41 GMT+0200"),
      intervention_end_date: new Date("Fri Jun 30 2021 13:49:41 GMT+0200"),
    },
    {
      id: 2,
      done: false,
      estimated_cost: 0,
      intervenant: "Javi",
      intervention_type: "indepthdiagnostic",
      intervention_start_date: new Date("Fri Jun 23 2021 13:49:41 GMT+0200"),
      intervention_end_date: new Date("Fri Jun 24 2021 13:49:41 GMT+0200"),
      tree_id: 1,
      properties: {},
      required_documents: [],
      required_material: [],
    },
    {
      id: 7,
      done: false,
      estimated_cost: 0,
      intervenant: "Javi",
      intervention_type: "indepthdiagnostic",
      intervention_start_date: new Date("Wed Aug 04 2021 14:09:39 GMT+0200"),
      intervention_end_date: new Date("Wed Aug 04 2021 14:09:39 GMT+0200"),
      tree_id: 1,
      properties: {},
      required_documents: [],
      required_material: [],
    },
  ]);
  const [doneInterventions, setDoneInterventions] = useState<TIntervention[]>([
    {
      id: 3,
      done: true,
      date: new Date(),
      estimated_cost: 0,
      intervenant: "Javi",
      intervention_type: "pruning",
      tree_id: 1,
      properties: {},
      required_documents: [],
      required_material: [],
    },
    {
      id: 4,
      done: true,
      date: new Date(),
      estimated_cost: 0,
      intervenant: "Javi",
      intervention_type: "streanremoval",
      tree_id: 1,
      properties: {},
      required_documents: [],
      required_material: [],
    },
    {
      id: 5,
      done: true,
      date: new Date(),
      estimated_cost: 0,
      intervenant: "Javi",
      intervention_type: "surveillance",
      tree_id: 1,
      properties: {},
      required_documents: [],
      required_material: [],
    },
    {
      id: 6,
      done: true,
      date: new Date(),
      estimated_cost: 0,
      intervenant: "Javi",
      intervention_type: "treatment",
      tree_id: 1,
      properties: {},
      required_documents: [],
      required_material: [],
    },
  ]);
  const { apiETK } = useApi().api;

  return (
    <InterventionContext.Provider
      value={{
        organizationInterventions,
        setOrganizationInterventions,
        interventionSelected,
        setInterventionSelected,
        scheduledInterventions,
        setScheduledInterventions,
        doneInterventions,
        setDoneInterventions,
      }}
    >
      {children}
    </InterventionContext.Provider>
  );
};

export default InterventionProvider;
