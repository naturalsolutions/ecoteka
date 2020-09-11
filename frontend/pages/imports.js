import { useState } from "react";
import Template from "../components/Template";
import ETKImportHistory from "../components/Import/History/Index";

export default function ImportsPage() {
  const [rows] = useState([]);

  const headers = ["Nom du fichier", "Date de l'import", "Status de l'import"];

  return (
    <Template>
      <ETKImportHistory headers={headers} rows={rows} />
    </Template>
  );
}
