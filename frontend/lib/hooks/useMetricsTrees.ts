import useApi from "@/lib/useApi";
import { object } from "@ucast/core";

export interface MetricTreesResponse {
    ratio : object;
    aggregates : object;
}

function useMetricsTrees(organizationId) {
  return async (): Promise<MetricTreesResponse | {}> => {
    const { apiETK } = useApi().api;

    try {
      const { data, status } = await apiETK.get(
        `/organization/${organizationId}/trees/metrics?fields=canonicalName,vernacularName,diameter,height,plantingDate`
      );
      if (status === 200) {
        return data as MetricTreesResponse;
      }
    } catch ({ response, request }) {
      return response.error;
    }
  };
}

export default useMetricsTrees;
