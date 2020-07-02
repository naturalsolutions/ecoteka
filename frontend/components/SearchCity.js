import { useState } from "react";
import { Select, Spin } from "antd";

export default function SearchCity(props) {
  const [value, setValue] = useState("");
  const [fetching, setFetching] = useState(false);
  const [items, setItems] = useState([]);

  function onChange(newValue) {
    if (newValue) {
      setValue(newValue);
      const parts = newValue.split(",");
      const data = {
        name: parts[0],
        center: [parts[1], parts[2]],
        population: parts[3],
      };

      if (props.onChange) {
        props.onChange(data);
      }
    } else {
      setValue("");
      setItems([]);
    }
  }

  const onSearch = async (value) => {
    if (value.length > 3) {
      let url = `https://geo.api.gouv.fr/communes?nom=${value}&fields=nom,code,codesPostaux,codeDepartement,centre,codeRegion,population&format=json&geometry=centre`;

      setFetching(true);
      const response = await fetch(url);
      const json = await response.json();
      const items = json.filter(
        (item) => item.centre && item.centre.coordinates
      );
      setFetching(false);
      setItems(items);
    } else {
      setItems([]);
    }
  };

  return (
    <Select
      value={value}
      showSearch
      showArrow={false}
      defaultActiveFirstOption={false}
      allowClear
      notFoundContent={fetching ? <Spin size="small" /> : null}
      filterOption={false}
      onChange={onChange}
      onSearch={onSearch}
      style={{ width: "100%" }}
    >
      {items.map((item) => (
        <Select.Option
          key={item.code}
          value={`${item.nom},${item.centre.coordinates[0]},${item.centre.coordinates[1]},${item.population}`}
        >
          {item.nom}
        </Select.Option>
      ))}
    </Select>
  );
}
