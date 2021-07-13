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
  const [selectedMembers, setSelectedMembers] = useState<number[]>([]);
  const [editableMembers, setEditableMembers] = useState<number[]>([]);
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

  const deleteOrganizationMember = async (memberId: number) => {
    try {
      const { status, data } = await apiETK.delete(
        `/organization/${organization.id}/members/${memberId}`
      );
      if (status === 200) {
        // const keptMembers = organizationMembers.filter(
        //   (member) => member.id !== memberId
        // );
        // const keptSelectedMembers = selectedMembers.filter(
        //   (id) => id !== memberId
        // );
        // setSelectedMembers(keptSelectedMembers);
        // setOrganizationMembers((prevMembers) => ({
        //   ...prevMembers.filter((member) => member.id !== memberId),
        // }));
        return memberId;
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
        editableMembers,
        setEditableMembers,
        fetchOrganizationMembers,
        deleteOrganizationMember,
      }}
    >
      {children}
    </MemberContext.Provider>
  );
};

export default MemberProvider;
