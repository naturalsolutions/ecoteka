import { useState } from "react";
import Autocomplete from "@material-ui/lab/Autocomplete";
import TextField from "@material-ui/core/TextField";

export default function Filter(props) {
  const [selected, setSelected] = useState();

  function onThemeChange(theme) {
    return theme === "light" ? null : { color: "white" };
  }

  function onFilter(e, value) {
    setSelected(value);

    if (props.onFilterSpecies) {
      props.onFilterSpecies(value);
    }
  }

  return (
    <div>
      <Autocomplete
        multiple
        options={props.speces}
        getOptionLabel={(option) => option}
        onChange={onFilter}
        renderInput={(params) => (
          <TextField
            {...params}
            variant="standard"
            label="Filter By Scientific Name"
            //fr label="Filtrer par nom scientifique"
          />
        )}
      />
    </div>
  );
}
