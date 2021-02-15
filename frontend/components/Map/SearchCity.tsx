import { TextField, CircularProgress, makeStyles } from "@material-ui/core";
import { Autocomplete } from "@material-ui/lab";
import { useState, useEffect, Fragment } from "react";
import { useTranslation } from "react-i18next";

export interface MapSearchCityProps {
  className?: string;
  style?: React.CSSProperties;
  onChange?(item: {}): void;
}

const defaultProps: MapSearchCityProps = {
  style: {},
  className: "",
  onChange: () => {},
};

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: theme.palette.background.default,
  },
}));

const MapSearchCity: React.FC<MapSearchCityProps> = (props) => {
  const { t } = useTranslation("components");
  const [value, setValue] = useState(null);
  const [inputValue, setInputValue] = useState("");
  const [options, setOptions] = useState([]);
  const [loading, setLoading] = useState(false);
  const classes = useStyles();

  useEffect(() => {
    let active = true;

    if (inputValue === "" || inputValue.length < 2) {
      setOptions([]);
      return undefined;
    }

    (async () => {
      setLoading(true);
      const url = `https://geo.api.gouv.fr/communes?nom=${inputValue}&fields=nom,code,codesPostaux,codeDepartement,centre,codeRegion,population&format=json&geometry=centre`;
      const response = await fetch(url);
      const json = await response.json();

      if (active) {
        const newOptions = json
          .filter((item) => item.centre && item.centre.coordinates)
          .sort((a, b) => {
            return b.population - a.population;
          });

        setOptions(newOptions);
      }

      setLoading(false);
    })();

    return () => {
      active = false;
    };
  }, [value, inputValue]);

  const onChangeHandler = (ev, newValue) => {
    if (newValue) {
      setValue(newValue);

      if (props.onChange) {
        props.onChange(newValue?.centre?.coordinates);
      }
    }
  };

  return (
    <Autocomplete
      freeSolo
      className={props.className}
      options={options}
      getOptionLabel={(option) => option.nom}
      loading={loading}
      value={value}
      style={props.style}
      size="small"
      onChange={onChangeHandler}
      onInputChange={(event, newInputValue) => {
        setInputValue(newInputValue);
      }}
      renderInput={(params) => (
        <TextField
          {...params}
          value={value}
          label={t("components.Map.SearchCity.label")}
          variant="outlined"
          InputProps={{
            ...params.InputProps,
            className: classes.root,
            endAdornment: (
              <Fragment>
                {loading ? (
                  <CircularProgress color="inherit" size={20} />
                ) : null}
                {params.InputProps.endAdornment}
              </Fragment>
            ),
          }}
        />
      )}
    />
  );
};

MapSearchCity.defaultProps = defaultProps;

export default MapSearchCity;
