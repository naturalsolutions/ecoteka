import { Button, Tooltip } from "antd";
import { MenuOutlined } from "@ant-design/icons";

export default function LayoutSiderToggle(props) {
  return (
    <Button
      icon={<MenuOutlined />}
      style={{
        height: "80px",
      }}
      type="primary"
      size="large"
      style={{
        borderRadius: 0,
        top: 0,
        left: 0,
        position: "absolute",
      }}
      onClick={props.onToggle}
    />
  );
}
