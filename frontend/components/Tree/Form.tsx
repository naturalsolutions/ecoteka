import { FC, useEffect } from "react";
import {
  Grid,
  makeStyles,
  Theme,
  Accordion,
  AccordionSummary,
  Typography,
  AccordionDetails,
  Box,
  Paper,
} from "@material-ui/core";
import useTreeSchema from "@/components/Tree/Schema";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import CoreTextField from "../Core/Field/TextField";
import CoreSwitch from "@/components/Core/Field/Switch";
import CoreSelect from "@/components/Core/Field/Select";
import DatePicker from "@/components/Core/Field/DatePicker";

import AutocompleteMultiSelect from "@/components/Core/Field/AutocompleteSelect";
import { Controller } from "react-hook-form";
import TreeCanonicalField from "./Field/Canonical";
import { useState } from "react";
import { fields as excludeFields } from "@/components/Tree/BasicForm";
import { useTreeContext } from "@/components/Tree/Provider";

export interface TreeFormProps {
  readOnly: boolean;
}

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    [theme.breakpoints.up("sm")]: {
      "& .MuiGrid-item:nth-child(odd) > .MuiBox-root": {
        paddingRight: theme.spacing(3),
      },
      "& .MuiGrid-item:nth-child(even) > .MuiBox-root": {
        paddingLeft: theme.spacing(3),
      },
    },
  },
  accordion: {
    background: theme.palette.background.paper,
  },
  accordionSummaryTitle: {
    textTransform: "uppercase",
    fontWeight: 700,
    fontSize: "15px",
  },
}));

interface TreeFormAccordionProps {
  title: string;
}

const TreeFormAccordion: FC<TreeFormAccordionProps> = ({ title, children }) => {
  const classes = useStyles();

  return (
    <Accordion elevation={0} className={classes.accordion}>
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        <Typography className={classes.accordionSummaryTitle}>
          {title}
        </Typography>
      </AccordionSummary>
      <AccordionDetails>{children}</AccordionDetails>
    </Accordion>
  );
};

const fieldTypes = {
  treecanonicalfield: TreeCanonicalField,
  textfield: CoreTextField,
  switch: CoreSwitch,
  select: CoreSelect,
  multiselect: AutocompleteMultiSelect,
  date: DatePicker,
};

const TreeForm: FC<TreeFormProps> = ({ readOnly = true }) => {
  const classes = useStyles();
  const schema = useTreeSchema();
  const { form } = useTreeContext();
  const [categories, setCategories] = useState({});

  useEffect(() => {
    const newCategories = Object.keys(schema).reduce(
      (accumulator, fieldName) => {
        if (excludeFields.includes(fieldName)) {
          return accumulator;
        }

        const field = schema[fieldName];

        if (!accumulator[field.category]) {
          accumulator[field.category] = {};
        }

        const type = schema[fieldName].type;

        let fieldProps = null;

        if (["textfield", "select", "switch"].includes(type)) {
          fieldProps = {
            ...schema[fieldName].component,
            error: Boolean(form.errors?.fieldName),
            defaultValue: "",
            InputProps: {
              readOnly,
            },
          };
        }

        if (["multiselect"].includes(type)) {
          fieldProps = {
            ...schema[fieldName].component,
            error: Boolean(form.errors?.fieldName),
            errorMessage: Boolean(form.errors?.fieldName?.message),
            defaultValue: [],
            inputProps: {
              InputProps: {
                readOnly,
              },
            },
          };
        }

        if (["treecanonicalfield", "date"].includes(type)) {
          fieldProps = {
            defaultValue: "",
            inputProps: {
              ...schema[fieldName].component,
              error: Boolean(form.errors?.fieldName),

              InputProps: {
                readOnly,
              },
            },
          };
        }

        if (type === "switch") {
          fieldProps = {
            ...schema[fieldName].component,
            defaultValue: false,
            error: Boolean(form.errors?.fieldName),
          };
        }

        accumulator[field.category][fieldName] = (
          <Controller
            {...fieldProps}
            as={fieldTypes[type]}
            name={fieldName}
            control={form.control}
          />
        );

        return accumulator;
      },
      {} as Record<string, Record<string, JSX.Element>>
    );

    setCategories(newCategories);
  }, [form]);

  return (
    <Paper data-test="tree-full-form" elevation={0} className={classes.root}>
      {Object.keys(categories).map((category) => (
        <TreeFormAccordion key={category} title={category}>
          <Grid container data-test={"tree-full-form-" + category}>
            {Object.keys(categories[category]).map((field) => (
              <Grid
                data-test={"tree-full-form-" + category + "field-" + field}
                key={field}
                item
                xs={12}
                sm={6}
              >
                <Box>{categories[category][field]}</Box>
              </Grid>
            ))}
          </Grid>
        </TreeFormAccordion>
      ))}
    </Paper>
  );
};

export default TreeForm;
