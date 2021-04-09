import { TIntervention } from "@/components/Interventions/Schema";

export default function useTree(api) {
  return async (
    organizationId: number,
    treeId: string
  ): Promise<TIntervention[]> => {
    try {
      const { status, data } = await api.get(
        `/organization/${organizationId}/trees/${treeId}/interventions`
      );

      if (status === 200) {
        return data;
      }
    } catch (error) {}
  };
}
