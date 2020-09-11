import { useState, useEffect } from "react";

import Template from "../components/Template";
import ETKImportHistory from "../components/Import/History/Index";

import { apiRest } from "../lib/api";

export default function ImportsPage() {
  const [rows, setRows] = useState([]);
  const headers = ["Nom du fichier", "Date de l'import", "Status de l'import"];

  useEffect(async () => {
    const rows = await apiRest.geofiles.getAll();

    setRows(rows);
  }, []);

  return (
    <Template>
      <ETKImportHistory headers={headers} rows={rows} />
    </Template>
  );
}
