import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import useTextField from "@/components/Form/useTextField";
import useSelect from "@/components/Form/useSelect";
import usePasswordField from "@/components/Form/usePasswordField";
import useDateRangeField from "@/components/Form/useDateRange";
import useSwitch from "@/components/Form/useSwitch";
import useCheckbox from "@/components/Form/useCheckbox";
import useAutocomplete from "@/components/Form/useAutocomplete";
import useControlledTextField from "@/components/Form/useControlledTextField";
import useTaxonAsyncAutocomplete from "@/components/Form/useTaxonAsyncAutocomplete";
import useDateField from "@/components/Form/useDate";
import useMultiSelect from "@/components/Form/useMultiSelect";

interface useETKFormSchema {
  [key: string]: {
    type: string;
    component: any;
    schema: any;
  };
}

interface useETKFormProps {
  mode?: "onBlur" | "onChange" | "onSubmit" | "onTouched" | "all";
  schema: useETKFormSchema;
  defaultValues?: any;
}

export default function useETKForm(props: useETKFormProps) {
  const shape = {};
  const controlledTextfields = {};
  const textfields = {};
  const passwordfields = {};
  const selects = {};
  const multiselects = {};
  const dateranges = {};
  const checkboxes = {};
  const switchs = {};
  const autocompletes = {};
  const taxonAsyncAutocompletes = {};
  const dates = {};

  for (const field in props.schema) {
    shape[field] = props.schema[field].schema;

    switch (props.schema[field].type) {
      case "textfield":
        textfields[field] = props.schema[field].component;
        break;
      case "controlledTextfield":
        controlledTextfields[field] = props.schema[field].component;
        break;
      case "passwordfield":
        passwordfields[field] = props.schema[field].component;
        break;
      case "select":
        selects[field] = props.schema[field].component;
        break;
      case "multiselect":
        multiselects[field] = props.schema[field].component;
        break;
      case "date":
        dates[field] = props.schema[field].component;
        break;
      case "daterange":
        dateranges[field] = props.schema[field].component;
        break;
      case "switch":
        switchs[field] = props.schema[field].component;
        break;
      case "checkbox":
        checkboxes[field] = props.schema[field].component;
        break;
      case "autocomplete":
        autocompletes[field] = props.schema[field].component;
        break;
      case "taxonAsyncAutocomplete":
        taxonAsyncAutocompletes[field] = props.schema[field].component;
        break;
      default:
        textfields[field] = props.schema[field].component;
    }
  }

  const schema = yup.object().shape(shape);

  type useETKFormSchema = yup.InferType<typeof schema>;

  const form = useForm<useETKFormSchema>({
    mode: props.mode || "onSubmit",
    resolver: yupResolver(schema),
    defaultValues: props.defaultValues,
  });

  const textfieldsComponents = useTextField({ fields: textfields, ...form });
  const controlledTextfieldsComponents = useControlledTextField({
    fields: controlledTextfields,
    ...form,
  });
  const selectsComponents = useSelect({ fields: selects, ...form });
  const multiselectsComponents = useMultiSelect({
    fields: multiselects,
    ...form,
  });
  const passwordsComponents = usePasswordField({
    fields: passwordfields,
    ...form,
  });

  const dataragesComponents = useDateRangeField({
    fields: dateranges,
    ...form,
  });

  const switchsComponents = useSwitch({
    fields: switchs,
    ...form,
  });

  const autocompletesComponents = useAutocomplete({
    fields: autocompletes,
    ...form,
  });

  const taxonAsyncAutocompletesComponents = useTaxonAsyncAutocomplete({
    fields: taxonAsyncAutocompletes,
    ...form,
  });

  const datesComponents = useDateField({
    fields: dates,
    ...form,
  });

  const fields = Object.assign(
    {},
    textfieldsComponents,
    controlledTextfieldsComponents,
    selectsComponents,
    multiselectsComponents,
    datesComponents,
    passwordsComponents,
    dataragesComponents,
    switchsComponents,
    autocompletesComponents,
    taxonAsyncAutocompletesComponents
  );

  return {
    fields,
    ...form,
  };
}
