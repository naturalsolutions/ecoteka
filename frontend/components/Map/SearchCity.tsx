import useApi from "@/lib/useApi";
import {
  TextField,
  CircularProgress,
  makeStyles,
  InputAdornment,
} from "@material-ui/core";
import { Autocomplete } from "@material-ui/lab";
import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { FlyToInterpolator } from "@deck.gl/core";
import { useMapContext } from "@/components/Map/Provider";
import SearchIcon from "@material-ui/icons/Search";

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
  const { apiMeili } = useApi().api;
  const { viewState, setViewState } = useMapContext();

  useEffect(() => {
    let active = true;

    if (inputValue === "" || inputValue.length < 2) {
      setOptions([]);
      return undefined;
    }

    (async () => {
      try {
        setLoading(true);
        const { data: json, status } = await apiMeili.get(
          `/indexes/osmname/search`,
          {
            params: {
              q: inputValue,
              limit: 200,
            },
          }
        );

        if (active && status === 200) {
          setOptions(json.hits);
        }

        setLoading(false);
      } catch (e) {
        setLoading(false);
      }
    })();

    return () => {
      active = false;
    };
  }, [value, inputValue]);

  const onChangeHandler = (ev, newValue) => {
    if (newValue?.lat && newValue?.lon) {
      setValue(newValue);

      if (props.onChange) {
        props.onChange([Number(newValue.lon), Number(newValue.lat)]);
      }

      if (setViewState) {
        setViewState({
          ...viewState,
          longitude: Number(newValue.lon),
          latitude: Number(newValue.lat),
          zoom: 12,
          transitionDuration: 1500,
          transitionInterpolator: new FlyToInterpolator(),
        });
      }
    }
  };

  return (
    <Autocomplete
      freeSolo
      className={props.className}
      options={options}
      getOptionLabel={(option) => `${option.name}, ${option.country}`}
      filterOptions={(x) => x}
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
          placeholder="Explorer les arbres d’une ville ..."
          variant="outlined"
          InputProps={{
            ...params.InputProps,
            className: classes.root,
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
            endAdornment: (
              <InputAdornment position="end">
                {loading ? (
                  <CircularProgress color="inherit" size={20} />
                ) : null}
                {params.InputProps.endAdornment}
              </InputAdornment>
            ),
          }}
        />
      )}
    />
  );
};

MapSearchCity.defaultProps = defaultProps;

export default MapSearchCity;
