import { TextField, CircularProgress } from "@material-ui/core";
import { Autocomplete } from "@material-ui/lab";
import { useState, useEffect, Fragment } from "react";
import { useTranslation } from "react-i18next";
import ETKMap from "./Map";

export interface ETKMapSearchCityProps {
  map: React.RefObject<ETKMap>;
  className?: string;
  style?: React.CSSProperties;
  onChange?(item: {}): void;
}

const defaultProps: ETKMapSearchCityProps = {
  map: undefined,
  style: {
    background: "#ffff",
  },
  className: "",
  onChange: () => {},
};

const ETKMapSearchCity: React.FC<ETKMapSearchCityProps> = (props) => {
  const { t } = useTranslation("components");
  const [value, setValue] = useState(null);
  const [inputValue, setInputValue] = useState("");
  const [options, setOptions] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let active = true;

    if (inputValue === "" || inputValue.length < 3) {
      setOptions([]);
      return undefined;
    }

    (async () => {
      setLoading(true);
      const url = `https://geo.api.gouv.fr/communes?nom=${inputValue}&fields=nom,code,codesPostaux,codeDepartement,centre,codeRegion,population&format=json&geometry=centre`;
      const response = await fetch(url);
      const json = await response.json();

      if (active) {
        const newOptions = json.filter(
          (item) => item.centre && item.centre.coordinates
        );

        const sort = (a, b) => {
          if (a.nom.toLowerCase() < b.nom.toLowerCase()) {
            return -1;
          }

          return 1;
        };

        setOptions(newOptions.sort(sort));
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

      if (props.map && newValue.centre && newValue.centre.coordinates) {
        props.map.current.map.setZoom(12);
        props.map.current.map.flyTo({
          center: newValue.centre.coordinates,
        });
      }

      if (props.onChange) {
        props.onChange(newValue);
      }
    } else {
      setValue(null);
      setOptions([]);
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
      onChange={onChangeHandler}
      onInputChange={(event, newInputValue) => {
        setInputValue(newInputValue);
      }}
      renderInput={(params) => (
        <TextField
          {...params}
          value={value}
          label={t("Map.SearchCity.label")}
          variant="outlined"
          InputProps={{
            ...params.InputProps,
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

ETKMapSearchCity.defaultProps = defaultProps;

export default ETKMapSearchCity;
