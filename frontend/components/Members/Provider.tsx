import { createContext, FC, useContext, useEffect, useState } from "react";
import useApi from "@/lib/useApi";
import { TMember } from "@/components/Members/Schema";
import { useAppContext } from "@/providers/AppContext";

export const MemberContext = createContext({} as any);

export interface MemberProviderProps {}

export const useMemberContext = () => useContext(MemberContext);

const MemberProvider: FC<MemberProviderProps> = ({ children }) => {
  const [member, setMember] = useState<TMember>();
  const [organizationMembers, setOrganizationMembers] = useState<TMember[]>([]);
  const [selectedMembers, setSelectedMembers] = useState<TMember[]>([]);
  const { apiETK } = useApi().api;
  const { organization } = useAppContext();

  const fetchOrganizationMembers = async () => {
    try {
      const { status, data } = await apiETK.get(
        `/organization/${organization.id}/members`
      );

      if (status === 200) {
        setOrganizationMembers(data);
      }
    } catch (error) {}
  };

  useEffect(() => {
    fetchOrganizationMembers();
  }, [organization]);

  return (
    <MemberContext.Provider
      value={{
        organizationMembers,
        setOrganizationMembers,
        selectedMembers,
        setSelectedMembers,
        fetchOrganizationMembers,
      }}
    >
      {children}
    </MemberContext.Provider>
  );
};

export default MemberProvider;
