import { FC, useEffect, useState } from "react";
import Calendar from "@/components/Interventions/Calendar/Index";
import { apiRest } from "@/lib/api";
import { useRouter } from "next/router";

const initialYear = new Date().getFullYear();

const CalendarPage: FC = ({}) => {
  const [interventions, setInterventions] = useState([]);
  const [year, setYear] = useState(initialYear);
  const router = useRouter();

  const getData = async (organizationId: number, year: number) => {
    const data = await apiRest.interventions.getByYear(organizationId, year);

    setInterventions(data);
  };

  const handleYearChange = (newYear: number) => {
    setYear(newYear);
  };

  useEffect(() => {
    if (router.query.id) {
      getData(Number(router.query.id), year);
    }
  }, [router.query.id, year]);

  return (
    <Calendar
      interventions={interventions}
      year={year}
      onYearChange={handleYearChange}
    />
  );
};

export default CalendarPage;
