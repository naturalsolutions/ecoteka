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

const SearchPlace: React.FC<MapSearchCityProps> = (props) => {
  const { t } = useTranslation("components");
  const [value, setValue] = useState(null);
  const [inputValue, setInputValue] = useState("");
  const [options, setOptions] = useState([]);
  const [loading, setLoading] = useState(false);
  const classes = useStyles();
  const { apiMeili } = useApi().api;

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
    if (newValue) {
      setValue(newValue);

      if (props.onChange) {
        props.onChange(newValue);
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
          placeholder={t("components.SearchPlace.placeholder")}
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

SearchPlace.defaultProps = defaultProps;

export default SearchPlace;
