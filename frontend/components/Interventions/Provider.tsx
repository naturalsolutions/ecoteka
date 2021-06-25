import { createContext, FC, useContext, useEffect, useState } from "react";
import useApi from "@/lib/useApi";
import { TIntervention } from "@/components/Interventions/Schema";
import { Tree } from "@/index";
import { useTreeContext } from "../Tree/Provider";
import { useAppContext } from "@/providers/AppContext";

export const InterventionContext = createContext({} as any);

export interface InterventionProviderProps {}

export const useInterventionContext = () => useContext(InterventionContext);

const InterventionProvider: FC<InterventionProviderProps> = ({ children }) => {
  const [intervention, setIntervention] = useState<TIntervention>();
  const [organizationInterventions, setOrganizationInterventions] = useState<
    TIntervention[]
  >([]);
  const [interventionSelected, setInterventionSelected] = useState<
    TIntervention[]
  >([]);
  const [scheduledInterventions, setScheduledInterventions] = useState<
    TIntervention[]
  >([]);
  const [doneInterventions, setDoneInterventions] = useState<TIntervention[]>(
    []
  );
  const { apiETK } = useApi().api;
  const { organization } = useAppContext();
  const { tree } = useTreeContext();

  const fetchTreeInterventions = async () => {
    try {
      const { data, status } = await apiETK.get(
        `/organization/${tree.organization_id}/trees/${tree.id}/interventions`
      );

      if (status === 200) {
        const newScheduledInterventions = data
          .filter((intervention) => !intervention.done)
          .sort(
            (a, b) =>
              new Date(b.intervention_start_date).getTime() -
              new Date(a.intervention_start_date).getTime()
          )
          .slice(0, 3);

        setScheduledInterventions(newScheduledInterventions);
      }
    } catch (e) {}
  };

  const fetchOrganizationInterventions = async () => {
    try {
      const { data, status } = await apiETK.get(
        `/organization/${organization.id}/interventions`
      );

      console.log(data);

      if (status === 200) {
        const newScheduledInterventions = data
          .filter((intervention) => !intervention.done)
          .sort(
            (a, b) =>
              new Date(b.intervention_start_date).getTime() -
              new Date(a.intervention_start_date).getTime()
          );

        setScheduledInterventions(newScheduledInterventions);
      }
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    fetchTreeInterventions();
  }, [tree]);

  useEffect(() => {
    fetchOrganizationInterventions();
  }, [organization]);

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
