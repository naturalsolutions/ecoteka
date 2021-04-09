import { Tree } from "@/index";

export default function useTree(api) {
  return async (organizationId: number, treeId: string): Promise<Tree> => {
    try {
      const { status, data } = await api.get(
        `/organization/${organizationId}/trees/${treeId}`
      );

      if (status === 200) {
        return data;
      }
    } catch (error) {}
  };
}
