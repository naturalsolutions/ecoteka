import { createContext, FC, useContext, useEffect, useState } from "react";
import useOrganizationForm from "@/components/Admin/Organization/useForm";
import { IOrganization } from "@/index";
import { AxiosInstance } from "axios";
import useApi from "@/lib/useApi";

export const AdminOrganizationContext = createContext({} as any);

export interface AdminOrganizationProviderProps {
  organizationId?: number;
}

const fetchOrganization = async (
  api: AxiosInstance,
  organizationId: number
): Promise<IOrganization> => {
  try {
    const { status, data } = await api.get(`/organization/${organizationId}`);

    if (status === 200) {
      return data;
    }
  } catch (error) {}
};

export const useAdminOrganizationContext = () =>
  useContext(AdminOrganizationContext);

const OrganizationProvider: FC<AdminOrganizationProviderProps> = ({
  organizationId,
  children,
}) => {
  const [organization, setOrganization] = useState<IOrganization>();
  const form = useOrganizationForm();
  const { apiETK } = useApi().api;

  useEffect(() => {
    if (organization) {
      Object.keys(organization).forEach((key) =>
        form.setValue(key, organization[key])
      );
    } else {
      form.reset();
    }
  }, [organization]);

  useEffect(() => {
    if (organizationId !== organization?.id) {
      (async () => {
        const newOrganization = await fetchOrganization(apiETK, organizationId);

        setOrganization(newOrganization);
      })();
    }
  }, [organizationId]);

  const onSave = async () => {
    try {
      const { status, data } = await apiETK.patch(
        `/organization/${organizationId}`,
        form.getValues()
      );

      if (status === 200) {
        setOrganization(data);
      }
    } catch (e) {}
  };

  const onCreate = async () => {
    try {
      const { status, data } = await apiETK.post(
        `/organization/${organizationId}`,
        form.getValues()
      );

      if (status === 200) {
        setOrganization(data);
      }
    } catch (e) {}
  };

  return (
    <AdminOrganizationContext.Provider
      value={{ organization, setOrganization, form, onSave, onCreate }}
    >
      {children}
    </AdminOrganizationContext.Provider>
  );
};

export default OrganizationProvider;
