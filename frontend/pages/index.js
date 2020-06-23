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

const mapRef = createRef();

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

export default () => {
  const [isSiderVisible, setIsSiderVisible] = useState(true);
  const [theme, setTheme] = useState("light");
  const [specesSelected, setSpecesSelected] = useState([]);
  const [filter, setFilter] = useState(null);
  const [viewMode, setViewMode] = useState("map");
  const [communes, setCommunes] = useState([]);
  const [commune, setCommune] = useState([]);

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

  let dataLoaded = false;

  const onStyleData = async () => {
    if (!dataLoaded) {
      dataLoaded = true;
      const response = await fetch(
        `${process.env.assetPrefix}/assets/cities.json`
      );
      const json = await response.json();

      setCommunes(json);
    }
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
                <Divider orientation="left">Filtre par commune</Divider>
                <Select
                  value={commune}
                  showSearch
                  onChange={(value) => {
                    setCommune(value);
                    let coord = value.split(",");
                    mapRef.current.map.setZoom(12);
                    mapRef.current.map.flyTo({
                      center: [coord[2], coord[1]],
                    });
                  }}
                  style={{ width: "100%" }}
                >
                  {communes.map((commune) => (
                    <Select.Option
                      key={commune.id}
                      value={`${commune.slug},${commune.gps_lat},${commune.gps_lng}`}
                    >
                      {commune.zip_code} {commune.name}
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
            onStyleData={onStyleData}
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
            style={{ position: "absolute", right: "1rem", bottom: "1.4rem" }}
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
