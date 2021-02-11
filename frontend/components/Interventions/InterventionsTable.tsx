import {
  Checkbox,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  IconButton,
} from "@material-ui/core";
import EditIcon from "@material-ui/icons/Edit";
import { FC } from "react";
import { useTranslation } from "react-i18next";
import { TIntervention } from "@/components/Interventions/Schema";
import { useRouter } from "next/router";

const InterventionsTable: FC<{
  tree: any;
  interventions: TIntervention[];
  onNewIntervention?(): void;
}> = ({ interventions, tree, onNewIntervention }) => {
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

  const renderInterventionDate = (intervention) => {
    const {
      date,
      intervention_start_date,
      intervention_end_date,
    } = intervention;

    if (date) {
      return formatDate(date);
    }

    if (intervention_start_date === intervention_end_date) {
      return formatDate(intervention_start_date);
    }

    return `${formatDate(intervention_start_date)} - ${formatDate(
      intervention_end_date
    )}`;
  };

  const handleOnEditIntervention = (intervention) => {
    router.push(`/map?panel=intervention-edit&intervention=${intervention.id}`);
  };

  return (
    <TableContainer component={Paper}>
      <Table size="small">
        <caption>
          <Button
            fullWidth
            size="small"
            color="primary"
            variant="outlined"
            onClick={() => {
              onNewIntervention();
              router.push(`/map/?panel=intervention&tree=${tree.id}`);
            }}
          >
            {t(
              "components.Intervention.interventionsTable.requestAnItervention"
            )}
          </Button>
        </caption>
        <TableHead>
          <TableRow>
            <TableCell>
              {t("components.Intervention.interventionsTable.date")}
            </TableCell>
            <TableCell>
              {t("components.Intervention.interventionsTable.type")}
            </TableCell>
            <TableCell>
              {t("components.Intervention.interventionsTable.state")}
            </TableCell>
            <TableCell />
          </TableRow>
        </TableHead>
        <TableBody>
          {interventions.length > 0 &&
            interventions.map((intervention, i) => {
              return (
                <TableRow key={i}>
                  <TableCell>{renderInterventionDate(intervention)}</TableCell>
                  <TableCell>
                    {t(`Intervention.types.${intervention.intervention_type}`)}
                  </TableCell>
                  <TableCell>
                    <Checkbox
                      disabled
                      checked={intervention.done}
                      color="primary"
                    />
                  </TableCell>
                  <TableCell>
                    <IconButton
                      size="small"
                      onClick={() => handleOnEditIntervention(intervention)}
                    >
                      <EditIcon />
                    </IconButton>
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
