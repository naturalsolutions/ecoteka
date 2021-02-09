import React, { FC, useState, memo } from "react";
import { useTranslation } from "react-i18next";
import {
  TextField,
  Grid,
  Typography,
  Chip,
  Box,
  Paper,
} from "@material-ui/core";
import { Autocomplete } from "@material-ui/lab";

const FILTERS = [
  { key: "canonicalName", label: "Canonical Name" },
  { key: "vernacularName", label: "Vernacular Name" },
];

export interface IMapFilter {
  initialValue: object;
  options?: object;
  onChange?(values: object): void;
}

const MapFilter: FC<IMapFilter> = ({ initialValue, options, onChange }) => {
  const { t } = useTranslation("components");
  const [value, setValue] = useState(initialValue);

  const handleValue = (key, newValue) => {
    const data = {
      ...value,
      [key]: newValue,
    };

    setValue(data);

    if (onChange) {
      const newData = { ...data };

      for (let key in newData) {
        newData[key] = newData[key].map((v) => v.value);
      }

      onChange(newData);
    }
  };

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
                  label={option.value}
                  style={{ backgroundColor: `rgb(${option.color?.join(",")})` }}
                  {...getTagProps({ index })}
                ></Chip>
              ))
            }
            renderOption={(option, { selected }) => (
              <React.Fragment>
                <Paper
                  style={{
                    backgroundColor: `rgb(${option.color?.join(",")})`,
                    width: 20,
                    height: 20,
                    margin: "0 3",
                  }}
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
