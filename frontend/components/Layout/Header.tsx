import { useState, MouseEventHandler } from "react";
import { Layout, Row, Col, Space, Switch } from "antd";
import { SwitchChangeEventHandler } from "antd/lib/switch";
import LayoutSiderToggle from "./SiderToggle";

export interface LayoutHeaderProps {
  logo: string;
  themeStyle: React.CSSProperties;
  onDarkThemeChange: SwitchChangeEventHandler;
  onLayoutSiderToggle: MouseEventHandler<HTMLElement>;
}

const LayoutHeader: React.FC<LayoutHeaderProps> = (props) => {
  const [darkTheme, setDarkTheme] = useState(false);

  function onDarkThemeChange(checked, e) {
    setDarkTheme(checked);

    if (props.onDarkThemeChange) {
      props.onDarkThemeChange(checked, e);
    }
  }

  return (
    <Layout.Header style={props.themeStyle}>
      <Row justify="start" align="middle">
        <LayoutSiderToggle onToggle={props.onLayoutSiderToggle} />
        <Col>
          <img src={props.logo} height="40px" />
        </Col>
        <Col xs={0} md={10}>
          <h2
            style={{
              margin: 0,
              color: "#01685a",
              fontSize: "1.8rem",
              fontWeight: "lighter",
            }}
          >
            4.6 million open trees
          </h2>
        </Col>
        <Col flex="auto" />
        <Col>
          <Space>
            <Switch
              checked={darkTheme}
              style={{ marginRight: "1rem" }}
              onChange={onDarkThemeChange}
            />
          </Space>
        </Col>
      </Row>
    </Layout.Header>
  );
};

export default LayoutHeader;
