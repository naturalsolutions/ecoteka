import { useState, useEffect } from "react";
import ETKImportHistory from "@/components/Import/History/Index";
import { useAppContext } from "@/providers/AppContext";
import { apiRest } from "@/lib/api";
import AppLayoutGeneral from "@/components/AppLayout/General";

export default function ImportsPage() {
  const { user, isLoading } = useAppContext();
  const [rows, setRows] = useState([]);

  const onDelete = async (selected) => {
    try {
      for (let name of selected) {
        await apiRest.geofiles.delete(user.currentOrganization.id, name);
      }

      await fetchData(user.currentOrganization.id);
    } catch (e) {}
  };

  const onImport = async (name) => {
    try {
      await apiRest.trees.importFromGeofile(user.currentOrganization.id, name);
    } catch (e) {}
  };

  async function fetchData(organizationId) {
    const rows = await apiRest.geofiles.getAll(organizationId);
    setRows(rows);
  }

  useEffect(() => {
    if (user) {
      fetchData(user.currentOrganization.id);
    }
  }, [user]);

  return (
    <AppLayoutGeneral>
      <ETKImportHistory rows={rows} onDelete={onDelete} onImport={onImport} />
    </AppLayoutGeneral>
  );
}
