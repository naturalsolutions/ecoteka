import {
  Checkbox,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@material-ui/core";
import { FC } from "react";
import { useTranslation } from "react-i18next";
import { TIntervention } from "./Schema";

const InterventionsTable: FC<{
  interventions: TIntervention[];
}> = (props) => {
  const { t } = useTranslation("components");
  //TODO generic
  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString("fr-FR", {
      year: "numeric",
      month: "numeric",
      day: "numeric",
    });
  };
  return (
    <TableContainer>
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell>Date</TableCell>
            <TableCell>Type</TableCell>
            <TableCell>État</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {props?.interventions.map((intervention, i) => {
            return (
              <TableRow key={i}>
                <TableCell>{formatDate(intervention.date)}</TableCell>
                <TableCell>
                  {t(`Intervention.types.${intervention.intervention_type}`)}
                </TableCell>
                <TableCell>
                  <Checkbox
                    checked={intervention.done}
                    color="primary"
                    readOnly
                  />
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default InterventionsTable;
