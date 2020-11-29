import { forwardRef, Fragment, useEffect, useImperativeHandle } from "react";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Grid,
  makeStyles,
  Typography,
} from "@material-ui/core";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import useETKForm from "../Form/useForm";
import useTreeSchema from "./Schema";
import { ITree } from "@/index";

const useStyles = makeStyles((theme) => ({
  heading: {
    fontSize: theme.typography.pxToRem(15),
    fontWeight: "bold",
  },
}));

export type TTreeAccordion = {
  getValues: () => object;
};

export const TreeAccordion = forwardRef<
  TTreeAccordion,
  {
    tree: ITree;
    onChange?(tree: ITree, properties: object): void;
  }
>((props, ref) => {
  const classes = useStyles();
  const schema = useTreeSchema();
  const { fields, setValue, getValues } = useETKForm({
    schema: schema,
  });

  useImperativeHandle(ref, () => ({
    getValues: getValues,
  }));

  useEffect(() => {
    for (let key in ["id", "x", "y"]) {
      setValue(key, props.tree[key]);
    }

    for (let key in props.tree.properties) {
      if (schema.hasOwnProperty(key)) {
        setValue(key, props.tree.properties[key]);
      }
    }
  }, [props.tree]);

  return props.tree ? (
    <Fragment>
      <Accordion expanded>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography className={classes.heading}>
            Identité de l'arbre
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Grid container direction="column">
            {Object.keys(schema)
              .filter((f) => schema[f].category === "Identité de l'arbre")
              .map((f) => (
                <Grid key={`${schema[f].category}-${f}`} item>
                  {fields[f]}
                </Grid>
              ))}
          </Grid>
        </AccordionDetails>
      </Accordion>
      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography className={classes.heading}>Caractéristiques</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Grid container direction="column">
            {Object.keys(schema)
              .filter((f) => schema[f].category === "Caractéristiques")
              .map((f) => (
                <Grid key={`${schema[f].category}-${f}`} item>
                  {fields[f]}
                </Grid>
              ))}
          </Grid>
        </AccordionDetails>
      </Accordion>
      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography className={classes.heading}>
            Environnement extérieur
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Grid container direction="column">
            {Object.keys(schema)
              .filter((f) => schema[f].category === "Environnement extérieur")
              .map((f) => (
                <Grid key={`${schema[f].category}-${f}`} item>
                  {fields[f]}
                </Grid>
              ))}
          </Grid>
        </AccordionDetails>
      </Accordion>
      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography className={classes.heading}>Autre</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Grid container direction="column">
            {Object.keys(schema)
              .filter((f) => schema[f].category === "Autre")
              .map((f) => (
                <Grid key={`${schema[f].category}-${f}`} item>
                  {fields[f]}
                </Grid>
              ))}
          </Grid>
        </AccordionDetails>
      </Accordion>
    </Fragment>
  ) : null;
});

export default TreeAccordion;
