import { useState } from "react";
import { Radio } from "antd";

export default function ViewMode(props) {
  const [viewMode, setViewMode] = useState("map");

  const onChange = (e) => {
    setViewMode(e.target.value);

    if (props.onChange) {
      props.onChange(e.target.value);
    }
  };

  return (
    <Radio.Group
      value={viewMode}
      defaultValue={viewMode}
      buttonStyle="solid"
      onChange={onChange}
    >
      <Radio.Button value="map">Map</Radio.Button>
      <Radio.Button value="satellite">Satellite</Radio.Button>
    </Radio.Group>
  );
}
