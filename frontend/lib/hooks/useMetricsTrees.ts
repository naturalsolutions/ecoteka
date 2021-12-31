import useApi from "@/lib/useApi";
import { useQuery } from "react-query";

function useMetricsTrees(
  organizationId,
  fields = "canonicalName,vernacularName,diameter,height,plantingDate"
) {
  return () => {
    const { apiETK } = useApi().api;

    return useQuery(
      ["metricstrees", organizationId],
      () =>
        apiETK
          .get(`/organization/${organizationId}/trees/metrics?fields=${fields}`)
          .then(({ data }) => {
            return data;
          }),
      { staleTime: Infinity }
    );
  };
}

export default useMetricsTrees;
