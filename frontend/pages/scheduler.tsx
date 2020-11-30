import { FC, useEffect, useState } from "react";
import Calendar from "@/components/Interventions/Calendar/Index";
import { apiRest } from "@/lib/api";
import { useAppContext } from "@/providers/AppContext";

const initialYear = new Date().getFullYear();

const CalendarPage: FC = ({}) => {
  const [interventions, setInterventions] = useState([]);
  const [year, setYear] = useState(initialYear);
  const { user } = useAppContext();

  const getData = async (organizationId: number, year: number) => {
    const data = await apiRest.interventions.getByYear(organizationId, year);

    setInterventions(data);
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
    <Calendar
      interventions={interventions}
      year={year}
      onYearChange={handleYearChange}
      onInterventionPlan={() => getData(user.currentOrganization.id, year)}
    />
  );
};

export default CalendarPage;
