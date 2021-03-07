import { FC, useEffect, useState } from "react";
import Calendar from "@/components/Interventions/Calendar/Index";
import useApi from "@/lib/useApi";
import { useAppContext } from "@/providers/AppContext";
import AppLayoutGeneral from "@/components/AppLayout/General";

const initialYear = new Date().getFullYear();

const CalendarPage: FC = ({}) => {
  const [interventions, setInterventions] = useState([]);
  const [year, setYear] = useState(initialYear);
  const { user } = useAppContext();
  const { apiETK } = useApi().api;

  const getData = async (organizationId: number, year: number) => {
    try {
      const { data } = await apiETK.get(
        `/organization/${organizationId}/interventions/year/${year}`
      );

      setInterventions(data);
    } catch (error) {
      console.log(error);
    }
  };

  const handleYearChange = (newYear: number) => {
    setYear(newYear);
  };

  useEffect(() => {
    if (user && user.currentOrganization.id) {
      getData(user.currentOrganization.id, year);
    }
  }, [user, year]);

  return (
    <AppLayoutGeneral>
      <Calendar
        interventions={interventions}
        year={year}
        onYearChange={handleYearChange}
        onInterventionPlan={() => getData(user.currentOrganization.id, year)}
        onSave={() => getData(user.currentOrganization.id, year)}
      />
    </AppLayoutGeneral>
  );
};

export default CalendarPage;
