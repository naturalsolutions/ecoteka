import { useState, useEffect } from "react";
import { useRouter } from "next/router";

import Template from "../components/Template";
import ETKImportHistory from "../components/Import/History/Index";
import { useAppContext } from "../providers/AppContext";
import { apiRest } from "../lib/api";

export default function ImportsPage() {
  const { user } = useAppContext();
  const router = useRouter();
  const [rows, setRows] = useState([]);
  const headers = ["Nom du fichier", "Date de l'import", "Status de l'import"];

  useEffect(() => {
    if (!user) {
      router.push("/");
    } else {
      try {
        async function fetchData() {
          const rows = await apiRest.geofiles.getAll();
          setRows(rows);
        }

        fetchData();
      } catch (e) {}
    }
  }, []);

  return (
    <Template>
      {user && <ETKImportHistory headers={headers} rows={rows} />}
    </Template>
  );
}
