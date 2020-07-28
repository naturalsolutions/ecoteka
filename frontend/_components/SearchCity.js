import { useState } from "react";
import { Select, Spin, Row, Col } from "antd";
import { SearchOutlined } from "@ant-design/icons";

export default function SearchCity(props) {
  const [value, setValue] = useState(null);
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
      setValue(null);
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
      size="large"
      showArrow={false}
      defaultActiveFirstOption={false}
      placeholder={
        <Row align="middle" gutter={10}>
          <Col>
            <Row>
              <SearchOutlined />
            </Row>
          </Col>
          <Col>
            <div>Search for a city</div>
          </Col>
        </Row>
      }
      allowClear
      notFoundContent={fetching ? <Spin size="small" /> : null}
      filterOption={false}
      onChange={onChange}
      onSearch={onSearch}
      style={{ width: "280px" }}
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
