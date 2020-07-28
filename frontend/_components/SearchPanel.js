import { useState } from "react";
import { Divider, Select } from "antd";

export default function SearchPanel(props) {
  const [selected, setSelected] = useState([]);

  function onThemeChange(theme) {
    return theme === "light" ? null : { color: "white" };
  }

  function onFilter(value) {
    setSelected(value);

    if (props.onFilterSpecies) {
      props.onFilterSpecies(value);
    }
  }

  return (
    <div>
      <Divider orientation="left" style={onThemeChange(props.theme)}>
        Filter By Scientific Name
      </Divider>
      <Select
        value={selected}
        onChange={onFilter}
        mode="tags"
        style={{ width: "100%" }}
      >
        {props.speces.map((spece) => (
          <Select.Option key={spece} value={spece}>
            {spece}
          </Select.Option>
        ))}
      </Select>
    </div>
  );
}
