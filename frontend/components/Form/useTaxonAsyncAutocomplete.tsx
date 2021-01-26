import React, { useState, useEffect } from "react";
import useApi from "@/lib/useApi";
import { CircularProgress, TextField, TextFieldProps } from "@material-ui/core";
import { Autocomplete } from "@material-ui/lab";
import { Controller } from "react-hook-form";

interface Fields {
  [key: string]: TextFieldProps | any;
}

interface ETKTextFieldProps {
  setValue: any;
  control: any;
  register: any;
  errors: any;
  fields: Fields;
}

interface TaxonType {
  id: number;
  ecoteka_canonical: string;
}

export default function useTaxonAsyncAutocomplete({
  setValue,
  control,
  register,
  errors,
  fields,
}: ETKTextFieldProps): Fields {
  const taxonAsyncAutocompleteFields = {};
  const { api } = useApi();
  const { apiMeili } = api;
  const [taxa, setTaxa] = useState<TaxonType[]>([]);
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [query, setQuery] = useState("");

  useEffect(() => {
    if (open) {
      searchTaxa(query);
    } else {
      setTaxa([]);
    }
  }, [open, query]);

  const searchTaxa = async (q: string) => {
    setIsLoading(true);
    try {
      const { data, status } = await apiMeili.get(
        `/indexes/taxa/search?q=${q}`
      );

      if (status === 200) {
        console.log(data);
        setTaxa(data.hits);
      } else {
        setTaxa([]);
      }
    } catch (e) {
    } finally {
      setIsLoading(false);
    }
  };

  const setTaxonomicValues = (data) => {
    if (!data) {
      setValue("genus", "");
      setValue("species", "");
    }
    if (data?.ecoteka_canonical) {
      const [genus, species] = data.ecoteka_canonical.split(" ");
      setValue("genus", genus);
      setValue("species", species);
    }
  };

  for (const name in fields) {
    const field = fields[name];
    const defaultFieldProps: TextFieldProps = {
      name,
      inputRef: register,
      variant: "filled",
      margin: "dense",
      InputProps: {
        disableUnderline: true,
      },
      label: field.label,
      placeholder: field.placeholder,
      type: field.type,
      fullWidth: true,
      error: Boolean(errors[name]),
      helperText: errors[name]?.message
        ? errors[name]?.message
        : field.helperText,
    };

    const fieldProps = Object.assign({}, defaultFieldProps, field);

    taxonAsyncAutocompleteFields[name] = (
      <Controller
        render={({ onChange, ...props }) => (
          <Autocomplete
            freeSolo
            open={open}
            onOpen={() => {
              setTaxa([]);
              setOpen(true);
            }}
            onClose={() => {
              setOpen(false);
              setTaxa([]);
              setIsLoading(false);
            }}
            onInputChange={(event, data) => {
              setQuery(data);
            }}
            options={taxa}
            loading={isLoading}
            getOptionLabel={(option) => option.ecoteka_canonical}
            filterOptions={(options, state) => options}
            renderOption={(option) => (
              <span>
                {option.id} - {option.ecoteka_canonical}
              </span>
            )}
            onChange={(e, data) => {
              onChange(data);
              setTaxonomicValues(data);
            }}
            {...props}
            renderInput={(params) => {
              return (
                <TextField
                  {...params}
                  label={fieldProps.label}
                  helperText={fieldProps.helperText}
                  variant={fieldProps.variant}
                  margin={fieldProps.margin}
                  InputProps={{
                    ...params.InputProps,
                    disableUnderline: true,
                    endAdornment: (
                      <React.Fragment>
                        {isLoading ? (
                          <CircularProgress color="inherit" size={20} />
                        ) : null}
                        {params.InputProps.endAdornment}
                      </React.Fragment>
                    ),
                  }}
                />
              );
            }}
          />
        )}
        defaultValue={{
          id: 0,
          t: "",
        }}
        onChange={([, data]) => data}
        name={name}
        control={control}
        key={name}
      />
    );
  }
  return taxonAsyncAutocompleteFields;
}
