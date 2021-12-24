import useApi from "@/lib/useApi";

export interface MetricByYearResponse {
  done_interventions_cost: number;
  logged_trees_count: number;
  plantedTrees_count: number;
  scheduled_interventions_cost: number;
  total_tree_count: number;
}

function useMetricsByYear(organizationId, year) {
  return async (): Promise<MetricByYearResponse | {}> => {
    const { apiETK } = useApi().api;

    try {
      const { data, status } = await apiETK.get(
        `/organization/${organizationId}/metrics_by_year/${year}`
      );
      if (status === 200) {
        return data as MetricByYearResponse;
      }
    } catch ({ response, request }) {
      return response.error;
    }
  };
}

export default useMetricsByYear;
