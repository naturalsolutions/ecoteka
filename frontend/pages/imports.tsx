import { useState, useEffect } from "react";
import ETKImportHistory from "@/components/Import/History/Index";
import { useAppContext } from "@/providers/AppContext";
import useAPI from "@/lib/useApi";
import AppLayoutGeneral from "@/components/AppLayout/General";

export default function ImportsPage() {
  const { user } = useAppContext();
  const [rows, setRows] = useState([]);
  const { apiETK } = useAPI().api;

  const onDelete = async (selected) => {
    try {
      for (let name of selected) {
        try {
          apiETK.delete(
            `/organization/${user.currentOrganization.id}/geo_files/${name}`
          );
          setRows(rows.filter((row) => row.name !== name));
        } catch (error) {}
      }
    } catch (e) {}
  };

  async function fetchData(organizationId) {
    try {
      const { data: rows } = await apiETK.get(
        `/organization/${organizationId}/geo_files/`
      );

      setRows(rows);
    } catch (errors) {}
  }

  useEffect(() => {
    if (user) {
      fetchData(user.currentOrganization.id);
    }
  }, [user]);

  return (
    <AppLayoutGeneral>
      <ETKImportHistory rows={rows} onDelete={onDelete} />
    </AppLayoutGeneral>
  );
}
