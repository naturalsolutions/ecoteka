import { createContext, FC, useContext, useEffect, useState } from "react";
import useApi from "@/lib/useApi";
import { TIntervention } from "@/components/Interventions/Schema";
import { useTreeContext } from "../Tree/Provider";
import { useAppContext } from "@/providers/AppContext";
import { useRouter } from "next/router";

export const InterventionContext = createContext({} as any);

export interface InterventionProviderProps {}

export const useInterventionContext = () => useContext(InterventionContext);

export const calculatePriority = ({ done, archived, start, end }) => {
  const nowDate = new Date();
  const endDate = new Date(end);
  const startDate = new Date(start);
  const twoWeeks = new Date();
  const oneDay = 1000 * 3600 * 24;

  twoWeeks.setTime(twoWeeks.getTime() - 15 * oneDay);

  const differenceInDays = Math.abs(
    nowDate.getTime() - new Date(startDate).getTime()
  );
  const distance = Math.floor(differenceInDays / oneDay);

  if (done) {
    return "done";
  }

  if (archived) {
    return "archived";
  }

  if (!done && startDate < nowDate) {
    return "late";
  }

  if (!done && !(start < nowDate) && distance <= 15) {
    return "urgent";
  }

  return "schedulable";
};

const TREE_ROUTES = [
  "/[organizationSlug]/map",
  "/[organizationSlug]/tree/[id]/intervention",
  "/[organizationSlug]/tree/[id]",
];

const ORGANIZATION_ROUTERS = ["/[organizationSlug]/interventions"];

const InterventionProvider: FC<InterventionProviderProps> = ({ children }) => {
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
  const [hasLateInterventions, setHasLateInterventions] =
    useState<boolean>(false);
  const { apiETK } = useApi().api;
  const { organization } = useAppContext();
  const { tree } = useTreeContext();
  const router = useRouter();

  const formatInterventions = (data: TIntervention[]) => {
    const lateInterventions = data.filter((intervention) => {
      const priority = calculatePriority({
        done: intervention.done,
        archived: false,
        start: intervention.intervention_start_date,
        end: intervention.intervention_end_date,
      });

      return priority === "urgent";
    });

    setHasLateInterventions(lateInterventions.length > 0);

    const newScheduledInterventions = data
      .filter((intervention) => !intervention.done)
      .sort(
        (a, b) =>
          new Date(b.intervention_start_date).getTime() -
          new Date(a.intervention_start_date).getTime()
      );

    setScheduledInterventions(newScheduledInterventions);

    const newDoneInterventions = data
      .filter((intervention) => intervention.done)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    setDoneInterventions(newDoneInterventions);
  };

  const fetchTreeInterventions = async () => {
    try {
      const { data, status } = await apiETK.get(
        `/organization/${tree.organization_id}/trees/${tree.id}/interventions`
      );

      if (status === 200) {
        formatInterventions(data);
      }
    } catch (e) {}
  };

  const fetchOrganizationInterventions = async () => {
    try {
      const { data, status } = await apiETK.get(
        `/organization/${organization.id}/interventions`
      );

      if (status === 200) {
        formatInterventions(data);
      }
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    if (tree?.id && TREE_ROUTES.includes(router.pathname)) {
      fetchTreeInterventions();
    }

    if (ORGANIZATION_ROUTERS.includes(router.pathname)) {
      fetchOrganizationInterventions();
    }
  }, [tree]);

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
        hasLateInterventions,
        setHasLateInterventions,
      }}
    >
      {children}
    </InterventionContext.Provider>
  );
};

export default InterventionProvider;
