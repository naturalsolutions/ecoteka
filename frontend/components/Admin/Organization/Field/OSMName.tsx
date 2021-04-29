import { useState, forwardRef, ChangeEvent } from "react";
import { Autocomplete } from "@material-ui/lab";
import {
  IconButton,
  InputAdornment,
  Menu,
  MenuItem,
  CircularProgress,
  TextFieldProps,
} from "@material-ui/core";
import InfoIcon from "@material-ui/icons/Info";
import CoreTextField from "@/components/Core/Field/TextField";
import useApi from "@/lib/useApi";
import { useEffect } from "react";

export interface OSMNameFieldProps {
  inputProps: TextFieldProps;
  defaultValue?: string;
  value?: string;
  onChange?(event: ChangeEvent<{}>): void;
}

const OSMNameField = forwardRef<void, OSMNameFieldProps>((props, ref) => {
  const { inputProps, value, defaultValue, ...autocompleteProps } = props;
  const { onChange } = autocompleteProps;
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const { apiMeili } = useApi().api;
  const [options, setOptions] = useState([]);
  const [open, setOpen] = useState<boolean>(false);
  const loading = open && options.length === 0;

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const fetchOptions = async (q: string) => {
    try {
      const { data, status } = await apiMeili.get(
        `/indexes/osmname/search?q=${q}`
      );

      if (status === 200) {
        return data.hits;
      } else {
        return [];
      }
    } catch (e) {
      return [];
    }
  };

  const handleOnChange = async (newValue) => {
    const newOptions = await fetchOptions(value);

    if (newOptions.length) {
      setOptions(newOptions);
    } else {
      setOpen(false);
    }

    onChange(newValue);
  };

  useEffect(() => {
    if (!open) {
      setOptions([]);
    }
  }, [open]);

  return (
    <>
      <Autocomplete
        ref={ref}
        {...autocompleteProps}
        disableClearable
        freeSolo
        value={value}
        loading={loading}
        options={options}
        open={open}
        onOpen={() => {
          setOpen(true && !inputProps.InputProps.readOnly);
        }}
        onClose={() => {
          setOpen(false);
        }}
        renderOption={(option) => option.name}
        getOptionSelected={(option, value) => {
          return option.name === value.name;
        }}
        getOptionLabel={(option) => {
          if (!option.name) {
            return option;
          }

          return option.name;
        }}
        onChange={(e, newValue) => {
          handleOnChange(newValue.name);
        }}
        renderInput={(params) => (
          <CoreTextField
            {...params}
            {...inputProps}
            onChange={(e) => {
              if (
                e.target.value !== "" ||
                e.target.value !== null ||
                e.target.value === value
              ) {
                handleOnChange(e.target.value);
              }
            }}
            InputProps={{
              ...params.InputProps,
              ...inputProps.InputProps,
              endAdornment: (
                <InputAdornment position="end">
                  {loading ? (
                    <CircularProgress color="inherit" size={20} />
                  ) : (
                    <IconButton onClick={handleClick}>
                      <InfoIcon />
                    </IconButton>
                  )}
                </InputAdornment>
              ),
            }}
          />
        )}
      />
      <Menu
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={handleClose}
      >
        <MenuItem onClick={handleClose}>OSM</MenuItem>
        <MenuItem onClick={handleClose}>Wikidata</MenuItem>
      </Menu>
    </>
  );
});

export default OSMNameField;
