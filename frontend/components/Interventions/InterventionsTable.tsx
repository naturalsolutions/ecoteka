import {
  Checkbox,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Box,
  Button,
} from "@material-ui/core";
import { FC } from "react";
import { useTranslation } from "react-i18next";
import { TIntervention } from "@/components/Interventions/Schema";
import { useRouter } from "next/router";
import { INTERVENTION_COLORS } from "@/components/Interventions/constants";

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
    router.push(
      `/map?panel=intervention-edit&intervention=${intervention.id}&tree=${intervention.tree_id}`
    );
  };

  return (
    <TableContainer component={Paper}>
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell padding="none" align="center" />
            <TableCell padding="none">
              {t("components.Intervention.interventionsTable.date")}
            </TableCell>
            <TableCell padding="none">
              {t("components.Intervention.interventionsTable.type")}
            </TableCell>
            <TableCell padding="none">
              {t("components.Intervention.interventionsTable.state")}
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {interventions?.length > 0 &&
            interventions.map((intervention, i) => {
              return (
                <TableRow key={i}>
                  <TableCell padding="none">
                    <Box
                      m={1}
                      style={{
                        width: 15,
                        height: 15,
                        background:
                          INTERVENTION_COLORS[intervention.intervention_type],
                      }}
                    />
                  </TableCell>
                  <TableCell padding="none">
                    {renderInterventionDate(intervention)}
                  </TableCell>
                  <TableCell padding="none">
                    <Button
                      size="small"
                      style={{
                        textAlign: "left",
                      }}
                      onClick={() => handleOnEditIntervention(intervention)}
                    >
                      {t(
                        `Intervention.types.${intervention.intervention_type}`
                      )}
                    </Button>
                  </TableCell>
                  <TableCell padding="none">
                    <Checkbox
                      disabled
                      checked={intervention.done}
                      color="primary"
                    />
                  </TableCell>
                </TableRow>
              );
            })}
        </TableBody>
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
      </Table>
    </TableContainer>
  );
};

export default InterventionsTable;
