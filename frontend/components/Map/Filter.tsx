import React, { FC, useState, memo, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { TextField, Grid, makeStyles } from "@material-ui/core";
import { Autocomplete } from "@material-ui/lab";
import useApi from "@/lib/useApi";

export interface IMapFilter {
  initialValue: object;
  organizationId: number;
  onChange?(values: object): void;
}

const useStyles = makeStyles({});

const defaultValue = {
  canonicalName: [],
  vernacularName: [],
};

const MapFilter: FC<IMapFilter> = ({
  initialValue,
  organizationId,
  onChange,
}) => {
  const { t } = useTranslation("components");
  const classes = useStyles();
  const { apiETK } = useApi().api;
  const [filter, setFilter] = useState(defaultValue);
  const [value, setValue] = useState(initialValue || defaultValue);

  async function getData() {
    try {
      const { status, data } = await apiETK.get("/maps/filter", {
        params: {
          organization_id: organizationId,
        },
      });

      if (status === 200) {
        setFilter(data);
      }
    } catch (error) {}
  }

  useEffect(() => {
    getData();
  }, []);

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
        <Autocomplete
          className={classes.autocomplete}
          freeSolo
          multiple
          selectOnFocus
          clearOnBlur
          options={filter.canonicalName}
          getOptionLabel={(option) => option.value}
          fullWidth
          value={value.canonicalName}
          renderInput={(params) => (
            <TextField {...params} label="Canonical Name" variant="outlined" />
          )}
          onChange={(e, v) => handleValue("canonicalName", v)}
        />
      </Grid>
      <Grid item>
        <Autocomplete
          className={classes.autocomplete}
          freeSolo
          multiple
          selectOnFocus
          clearOnBlur
          options={filter.vernacularName}
          getOptionLabel={(option) => option.value}
          fullWidth
          value={value.vernacularName}
          renderInput={(params) => (
            <TextField {...params} label="Vernacular Name" variant="outlined" />
          )}
          onChange={(e, v) => handleValue("vernacularName", v)}
        />
      </Grid>
    </Grid>
  );
};

export default memo(MapFilter);
