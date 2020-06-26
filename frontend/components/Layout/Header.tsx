import { useState } from "react";
import { Layout, Row, Col, Space, Switch } from "antd";
import { SwitchChangeEventHandler } from "antd/lib/switch";

export interface LayoutHeaderProps {
  logo: string;
  themeStyle: React.CSSProperties;
  onDarkThemeChange: SwitchChangeEventHandler;
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
      <Row align="middle">
        <img src={props.logo} height="40px" />
        <Col flex="auto">
          <Row justify="start">
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
        </Col>
      </Row>
    </Layout.Header>
  );
};

export default LayoutHeader;
