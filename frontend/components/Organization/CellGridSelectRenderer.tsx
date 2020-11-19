import { MenuItem, Select } from "@material-ui/core";
import { useState } from "react";

const CellGridSelectRenderer = (props) => {
  //   console.log(props);
  const items = props.colDef.cellRendererParams?.items;
  //   const initValue = props.value
  console.log(props.getValue());
  const initValue =
    items?.find((item) => {
      return item.value == props.getValue();
    })?.value || "";

  const [value, setValue] = useState(initValue);

  function handleChange(e) {
    const newValue = e.target.value;
    setValue(newValue);
    props.setValue(newValue);
    props.colDef.cellRendererParams?.onChange?.(props, newValue, value);
  }

  return (
    <Select value={value} displayEmpty onChange={handleChange} autoWidth>
      <MenuItem value="" disabled>
        {props.colDef.cellRendererParams?.placeholder}
      </MenuItem>
      {items.map((item, i) => {
        return (
          <MenuItem value={item.value} key={i}>
            {item.label}
          </MenuItem>
        );
      })}
    </Select>
  );
};

export default CellGridSelectRenderer;
