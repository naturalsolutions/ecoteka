import { useState, useEffect, createRef } from "react";
import {
  Layout,
  Button,
  Row,
  Col,
  Tooltip,
  Switch,
  Select,
  Divider,
  Radio,
  Space,
  Affix,
} from "antd";
import { MenuOutlined } from "@ant-design/icons";
import Map from "../components/Map";
import speces from "../public/assets/speces.json";

const { Header, Sider, Content } = Layout;

export default () => {
  const mapRef = createRef();
  const [isSiderVisible, setIsSiderVisible] = useState(true);
  const [theme, setTheme] = useState("light");
  const [specesSelected, setSpecesSelected] = useState([]);
  const [filter, setFilter] = useState(null);
  const [viewMode, setViewMode] = useState("map");
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

  const filterSpeces = (values) => {
    setSpecesSelected(values);

    if (!values.length) {
      return setFilter(null);
    }

    setFilter(["in", "genre_latin", ...values]);
  };

  const onChangeViewMode = (e) => {
    setViewMode(e.target.value);
    mapRef.current.map.setLayoutProperty(
      "satellite",
      "visibility",
      viewMode !== "map" ? "none" : "visible"
    );
  };

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
                <Space>
                  <Switch
                    style={{ marginRight: "1rem" }}
                    onChange={() => {
                      setTheme(theme === "light" ? "dark" : "light");
                    }}
                  />
                </Space>
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
              <div
                style={{
                  padding: "1rem",
                  boxSizing: "border-box",
                }}
              >
                <Radio.Group
                  defaultValue={viewMode}
                  buttonStyle="solid"
                  onChange={onChangeViewMode}
                >
                  <Radio.Button value="map">Carte</Radio.Button>
                  <Radio.Button value="satellite">Satellite</Radio.Button>
                </Radio.Group>
                <Divider orientation="left">Filtre par genre latin</Divider>
                <Select
                  value={specesSelected}
                  onChange={(value) => {
                    setSpecesSelected(value);
                    filterSpeces(value);
                  }}
                  mode="tags"
                  style={{ width: "100%" }}
                >
                  {speces.map((spece) => (
                    <Select.Option key={spece} value={spece}>
                      {spece}
                    </Select.Option>
                  ))}
                </Select>
              </div>
            </Col>
          </Row>
        </Sider>
        <Content style={{ position: "relative" }}>
          <Map
            ref={mapRef}
            style={`${process.env.assetPrefix}/assets/${theme}/style.json`}
            filter={filter}
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
          <Affix
            style={{ position: "absolute", right: "1rem", bottom: "1rem" }}
          >
            <Button
              type="primary"
              shape="round"
              href="https://www.natural-solutions.eu/contacts"
              target="_blank"
            >
              En savoir plus
            </Button>
          </Affix>
        </Content>
      </Layout>
    </Layout>
  );
};
