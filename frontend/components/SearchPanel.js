import { useState } from "react";
import { Divider, Select } from "antd";
import SearchCity from "./SearchCity";

export default function SearchPanel(props) {
  const [selected, setSelected] = useState([]);

  function onFilter(value) {
    setSelected(value);

    if (props.onFilterSpecies) {
      props.onFilterSpecies(value);
    }
  }

  return (
    <div>
      <Divider orientation="left">Filtre par commune</Divider>
      <SearchCity items={props.communes} onChange={props.onSearchCityChange} />
      <Divider orientation="left">Filtre par genre latin</Divider>
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
