import { useState, useEffect, createRef } from "react";
import { Layout, Button, Row, Col, Tooltip } from "antd";
import { CaretLeftOutlined } from "@ant-design/icons";
import Map from "../components/Map";

const { Header, Sider, Content } = Layout;

export default () => {
  const mapRef = createRef();
  const [isSiderVisible, setIsSiderVisible] = useState(false);
  const [theme, setTheme] = useState("dark");
  const headerStyles = {
    padding: 0,
    height: "50px",
    lineHeight: "50px",
  };

  useEffect(() => {
    setTimeout(() => {
      window.dispatchEvent(new Event("resize"));
    }, 200);
  });

  const themes = {
    dark: {
      logo: `${process.env.assetPrefix}/assets/dark/Ecoteka_logo_dark.svg`,
    },
    light: {
      logo: `${process.env.assetPrefix}/assets/light/Ecoteka_logo_light.svg`,
    },
  };

  return (
    <Layout className="etkMainLayout">
      <Header style={headerStyles}>
        <img src={themes[theme].logo} height="100%" />
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
              sdsdsdsdsd
            </Col>
          </Row>
        </Sider>
        <Content style={{ position: "relative" }}>
          <Map ref={mapRef} />
          <Tooltip placement="right" title="ddddd">
            <Button
              icon={<CaretLeftOutlined />}
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
