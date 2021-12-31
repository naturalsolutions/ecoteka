import useApi from "@/lib/useApi";
import { useQuery } from "react-query";

export interface MetricByYearResponse {
  done_interventions_cost: number;
  logged_trees_count: number;
  plantedTrees_count: number;
  scheduled_interventions_cost: number;
  total_tree_count: number;
}

function useMetricsByYear(organizationId, year) {
  return () => {
    const { apiETK } = useApi().api;

    return useQuery(
      ["metricsbyyear", organizationId, year],
      () =>
        apiETK
          .get(`/organization/${organizationId}/metrics_by_year/${year}`)
          .then(({ data }) => {
            return data;
          }),
      { staleTime: Infinity }
    );
  };
}

export default useMetricsByYear;
