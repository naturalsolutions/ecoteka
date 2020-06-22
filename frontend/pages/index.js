import { useState, useEffect, createRef } from "react";
import { Layout, Button, Row, Col, Tooltip, Switch } from "antd";
import { MenuOutlined } from "@ant-design/icons";
import Map from "../components/Map";

const { Header, Sider, Content } = Layout;

export default () => {
  const mapRef = createRef();
  const [isSiderVisible, setIsSiderVisible] = useState(true);
  const [theme, setTheme] = useState("light");
  const headerStyles = {
    padding: 0,
    height: "50px",
    lineHeight: "50px",
  };

  const themeStyle = {
    dark: {
      header: {
        background: "#161616",
        ...headerStyles,
      },
    },

    light: {
      header: {
        background: "#fff",
        ...headerStyles,
      },
    },
  };

  useEffect(() => {
    setTimeout(() => {
      window.dispatchEvent(new Event("resize"));
    }, 200);
  });

  return (
    <Layout className="etkMainLayout">
      <Header style={themeStyle[theme].header}>
        <Row align="middle">
          <img
            src={`${process.env.assetPrefix}/assets/${theme}/logo.svg`}
            height="40px"
          />
          <Col flex="auto">
            <Row flex="auto" justify="right">
              <Col flex="auto"></Col>
              <Col>
                <Switch
                  style={{ marginRight: "1rem" }}
                  onChange={() => {
                    setTheme(theme === "light" ? "dark" : "light");
                  }}
                />
              </Col>
            </Row>
          </Col>
        </Row>
      </Header>
      <Layout>
        <Sider
          theme={theme}
          collapsed={isSiderVisible}
          collapsedWidth={0}
          width={300}
        >
          <Row>
            <Col
              flex="auto"
              style={{ display: !isSiderVisible ? "block" : "none" }}
            >
              Panel lateral
            </Col>
          </Row>
        </Sider>
        <Content style={{ position: "relative" }}>
          <Map
            ref={mapRef}
            style={`${process.env.assetPrefix}/assets/${theme}/style.json`}
          />
          <Tooltip
            placement="right"
            title={`${
              isSiderVisible ? "Afficher" : "Oculter"
            } le panneau lateral`}
          >
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
              onClick={() => {
                setIsSiderVisible(!isSiderVisible);
              }}
            />
          </Tooltip>
        </Content>
      </Layout>
    </Layout>
  );
};
