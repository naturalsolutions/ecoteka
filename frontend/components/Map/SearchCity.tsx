import useApi from "@/lib/useApi";
import {
  TextField,
  CircularProgress,
  makeStyles,
  InputAdornment,
} from "@material-ui/core";
import { Autocomplete } from "@material-ui/lab";
import { useState, useEffect, useCallback } from "react";
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
  const [value, setValue] = useState(null);
  const [inputValue, setInputValue] = useState("");
  const [options, setOptions] = useState([]);
  const [loading, setLoading] = useState(false);
  const classes = useStyles();
  const { apiMeili } = useApi().api;
  const { viewState, setViewState } = useMapContext();

  const fetchData = useCallback(async () => {
    if (inputValue.length < 2) {
      setOptions([]);
    }

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

      if (status === 200) {
        setOptions(json.hits);
      }

      setLoading(false);
    } catch (e) {
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inputValue]);

  useEffect(() => {
    const newInputValue = `${value?.name}, ${value?.country}`;

    if (inputValue && newInputValue !== inputValue) {
      fetchData();
    }
  }, [inputValue, value, fetchData]);

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
      data-testid="autocomplete"
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
                ) : (
                  params.InputProps.endAdornment
                )}
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
