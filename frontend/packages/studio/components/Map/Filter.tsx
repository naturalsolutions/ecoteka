import React, { FC, useState, memo, useEffect } from "react";
import { useTranslation } from "react-i18next";
import {
  TextField,
  Grid,
  Chip,
  Avatar,
} from "@material-ui/core";
import { Autocomplete } from "@material-ui/lab";
import useApi from "@/lib/useApi";
import { AppLayoutCartoDialog } from "../AppLayout/Carto";
import { useRouter } from "next/router";
import BackToMap from "./BackToMap";

const FILTERS_KEYS = ["canonicalName", "vernacularName"];

let defaultOptions = {};


for (let filter of FILTERS_KEYS) {
  defaultOptions[filter] = [];
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
  const { t } = useTranslation();
  const [value, setValue] = useState(initialValue);
  const [active, setActive] = useState<boolean>(false);
  const [options, setOptions] = useState(defaultOptions);
  const [loading, setLoading] = useState(false);
  const { apiETK } = useApi().api;
  const router = useRouter();
  const translations = t("components.MapFilter.filters", { returnObjects: true });
  const FILTERS = FILTERS_KEYS.map((key) => {
    return { key, label: translations[key] };
  });


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

  const renderChip = (option, tagProps?) => {
    const { inputValue, ...rest } = tagProps;

    return (
      <Chip
        key={`key-${option.value}`}
        label={`${option.value} (${option.total})`}
        avatar={
          <Avatar
            style={{
              backgroundColor: `rgb(${option["background"]})`,
            }}
          >
            &nbsp;
          </Avatar>
        }
        {...rest}
      />
    );
  };

  useEffect(() => {
    const { query, route } = router;

    if (route === "/[organizationSlug]/map" && query.panel === "filter") {
      setActive(true);
    } else {
      setActive(false);
    }
  }, [router.query]);

  return (
    active && (
      <AppLayoutCartoDialog
        title={t("components.Map.Filter.title")}
        actions={<BackToMap />}
      >
        <Grid container direction="column" spacing={3}>
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
                  <TextField
                    {...params}
                    label={filter.label}
                    variant="outlined"
                  />
                )}
                renderTags={(value, getTagProps) =>
                  value.map((option, index) =>
                    renderChip(option, getTagProps({ index }))
                  )
                }
                renderOption={renderChip}
                onChange={(e, v) => handleValue(filter.key, v)}
              />
            </Grid>
          ))}
        </Grid>
      </AppLayoutCartoDialog>
    )
  );
};

export default memo(MapFilter);
