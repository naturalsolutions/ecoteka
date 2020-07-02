import { Button } from "antd";
import { MenuOutlined, CloseCircleOutlined } from "@ant-design/icons";
import { useState } from "react";

export default function LayoutSiderToggle(props) {
  const [active, setActive] = useState(false);

  function onClick() {
    setActive(!active);
    props.onToggle();
  }

  return (
    <Button
      icon={active ? <CloseCircleOutlined /> : <MenuOutlined />}
      style={{ height: "50px", marginRight: ".3rem", borderRadius: 0 }}
      type="primary"
      size="large"
      onClick={onClick}
    />
  );
}
