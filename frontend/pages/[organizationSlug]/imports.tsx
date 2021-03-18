import { useState, useEffect } from "react";
import ImportHistory from "@/components/Import/History/Index";
import { useAppContext } from "@/providers/AppContext";
import useAPI from "@/lib/useApi";
import AppLayoutGeneral from "@/components/AppLayout/General";

export default function ImportsPage() {
  const { organization } = useAppContext();
  const [rows, setRows] = useState([]);
  const { apiETK } = useAPI().api;

  const onDelete = async (selected) => {
    try {
      for (let name of selected) {
        try {
          apiETK.delete(`/organization/${organization.id}/geo_files/${name}`);
        } catch (error) {}
      }

      setRows(rows.filter((row) => !selected.includes(row.name)));
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
    if (organization) {
      fetchData(organization.id);
    }
  }, [organization]);

  return (
    <AppLayoutGeneral>
      <ImportHistory rows={rows} onDelete={onDelete} />
    </AppLayoutGeneral>
  );
}
