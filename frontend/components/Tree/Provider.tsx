import { createContext, FC, useContext, useEffect, useState } from "react";
import useTreeForm from "@/components/Tree/useForm";
import { Tree } from "@/index";
import { AxiosInstance } from "axios";
import useApi from "@/lib/useApi";

export const TreeContext = createContext({} as any);

export interface TreeProviderProps {
  treeId: number;
  organizationId: number;
}

const fetchTree = async (
  api: AxiosInstance,
  organizationId: number,
  treeId: number
): Promise<Tree> => {
  try {
    const { status, data } = await api.get(
      `/organization/${organizationId}/trees/${treeId}`
    );

    if (status === 200) {
      return data;
    }
  } catch (error) {}
};

export const useTreeContext = () => useContext(TreeContext);

const TreeProvider: FC<TreeProviderProps> = ({
  treeId,
  organizationId,
  children,
}) => {
  const [tree, setTree] = useState<Tree>();
  const form = useTreeForm();
  const { apiETK } = useApi().api;

  useEffect(() => {
    if (tree?.properties) {
      Object.keys(tree.properties).forEach((property) =>
        form.setValue(property, tree.properties[property])
      );
    } else {
      form.reset();
    }
  }, [tree]);

  useEffect(() => {
    if (treeId !== tree?.id) {
      (async () => {
        const newTree = await fetchTree(apiETK, organizationId, treeId);

        setTree(newTree);
      })();
    }
  }, [treeId]);

  const onSave = async () => {
    try {
      const { status, data } = await apiETK.put(
        `/organization/${organizationId}/trees/${treeId}`,
        {
          properties: form.getValues(),
        }
      );

      if (status === 200) {
        setTree(data);
      }
    } catch (e) {}
  };

  return (
    <TreeContext.Provider value={{ tree, setTree, form, onSave }}>
      {children}
    </TreeContext.Provider>
  );
};

export default TreeProvider;
