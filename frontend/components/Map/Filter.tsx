import React, { FC, useState, memo, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { TextField, Grid, Typography, Chip, Box } from "@material-ui/core";
import { Autocomplete } from "@material-ui/lab";
import { useThemeContext } from "@/lib/hooks/useThemeSwitcher";
import useApi from "@/lib/useApi";

const FILTERS = [
  { key: "canonicalName", label: "Canonical Name" },
  { key: "vernacularName", label: "Vernacular Name" },
];

let defaultOptions = {};

for (let filter of FILTERS) {
  defaultOptions[filter.key] = [];
}

export interface IMapFilter {
  organizationId: number;
  initialValue: {};
  onChange?(values: {}, filters: {}, options: {}): void;
}

const MapFilter: FC<IMapFilter> = ({
  initialValue,
  organizationId,
  onChange,
}) => {
  const { t } = useTranslation("components");
  const [value, setValue] = useState(initialValue);
  const { dark } = useThemeContext();
  const [options, setOptions] = useState(defaultOptions);
  const [loading, setLoading] = useState(false);
  const { apiETK } = useApi().api;

  const getFilters = async (organizationId: number) => {
    try {
      setLoading(true);
      const { status, data } = await apiETK.get("/maps/filter", {
        params: {
          organization_id: organizationId,
        },
      });

      if (status === 200) {
        setOptions(data);
      }
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };

  const handleValue = (key, newValue) => {
    const data = {
      ...value,
      [key]: newValue,
    };

    setValue(data);

    if (onChange) {
      const filters = { ...data };

      for (let key in filters) {
        filters[key] = filters[key].map((v) => v.value);
      }

      onChange(data, filters, options);
    }
  };

  useEffect(() => {
    if (organizationId) {
      getFilters(organizationId);
    }
  }, [organizationId]);

  return (
    <Grid container direction="column" spacing={3}>
      <Grid item>
        <Typography variant="h6">{t("components.Map.Filter.title")}</Typography>
      </Grid>
      {FILTERS.map((filter) => (
        <Grid key={filter.key} item>
          <Autocomplete
            freeSolo
            multiple
            loading={loading}
            selectOnFocus
            clearOnBlur
            options={options[filter.key]}
            getOptionLabel={(option) => option.value}
            fullWidth
            value={value[filter.key]}
            renderInput={(params) => (
              <TextField {...params} label={filter.label} variant="outlined" />
            )}
            renderTags={(value, getTagProps) =>
              value.map((option, index) => (
                <Chip
                  label={`${option.total} - ${option.value}`}
                  style={{
                    backgroundColor: `rgb(${option[
                      dark ? "color" : "background"
                    ]?.join(",")})`,
                    color: `rgb(${option[dark ? "background" : "color"]?.join(
                      ","
                    )})`,
                  }}
                  {...getTagProps({ index })}
                ></Chip>
              ))
            }
            renderOption={(option, { selected }) => (
              <React.Fragment>
                <Chip
                  style={{
                    backgroundColor: `rgb(${option[
                      dark ? "color" : "background"
                    ]?.join(",")})`,
                    color: `rgb(${option[dark ? "background" : "color"]?.join(
                      ","
                    )})`,
                  }}
                  label={option.total}
                />
                <Box ml={2}>{option.value}</Box>
              </React.Fragment>
            )}
            onChange={(e, v) => handleValue(filter.key, v)}
          />
        </Grid>
      ))}
    </Grid>
  );
};

export default memo(MapFilter);
