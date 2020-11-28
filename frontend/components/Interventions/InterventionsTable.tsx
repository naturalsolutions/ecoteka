import {
  Checkbox,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Grid,
  Button,
} from "@material-ui/core";
import { FC } from "react";
import { useTranslation } from "react-i18next";
import { TIntervention } from "./Schema";
import { useRouter } from "next/router";

const InterventionsTable: FC<{
  tree: any;
  interventions: TIntervention[];
}> = ({ interventions, tree }) => {
  const { t } = useTranslation("components");
  const router = useRouter();
  //TODO generic
  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString("fr-FR", {
      year: "numeric",
      month: "numeric",
      day: "numeric",
    });
  };
  return (
    <TableContainer component={Paper}>
      <Table size="small">
        <caption>
          <Grid container justify="flex-end">
            <Grid item>
              <Button
                size="small"
                onClick={() => {
                  router.push(`/?panel=newIntervention&tree=${tree.id}`);
                }}
              >
                Demander une intervention
              </Button>
            </Grid>
          </Grid>
        </caption>
        <TableHead>
          <TableRow>
            <TableCell>Date</TableCell>
            <TableCell>Type</TableCell>
            <TableCell>État</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {interventions?.map((intervention, i) => {
            return (
              <TableRow key={i}>
                <TableCell>
                  {intervention.date && formatDate(intervention.date)}
                  {!intervention.date &&
                    `${formatDate(
                      intervention.intervention_start_date
                    )} - ${formatDate(intervention.intervention_end_date)}`}
                </TableCell>
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
