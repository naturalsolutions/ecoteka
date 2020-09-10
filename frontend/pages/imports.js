import { makeStyles } from "@material-ui/core/styles";
import Template from "../components/Template";
import {
  Grid,
  Typography,
  Paper,
  Button,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
} from "@material-ui/core";

const useStyles = makeStyles({
  grid: {
    height: "100%",
  },
  paper: {
    height: "100%",
    padding: "1rem",
  },
});

export default function ImportsPage() {
  const classes = useStyles();

  return (
    <Template>
      <Grid container direction="column" className={classes.grid}>
        <Paper square className={classes.paper}>
          <Grid container>
            <Grid item xs={6}>
              <Typography variant="h5">Historique des imports</Typography>
            </Grid>
            <Grid item xs={6}>
              <Grid xs={12} container direction="row-reverse">
                <Button variant="contained" color="primary">
                  Importer
                </Button>
                <Button variant="contained" color="primary">
                  Supprimer
                </Button>
              </Grid>
            </Grid>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Nom du fichier</TableCell>
                    <TableCell>Date de l'import</TableCell>
                    <TableCell>Status de l'import</TableCell>
                  </TableRow>
                </TableHead>
              </Table>
            </TableContainer>
          </Grid>
        </Paper>
      </Grid>
    </Template>
  );
}
