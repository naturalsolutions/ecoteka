import { useState, useEffect, createRef } from "react";
import { Layout, Button, Row, Col, Tooltip, Switch, Space, Affix } from "antd";
import { MenuOutlined } from "@ant-design/icons";
import Map from "../components/Map";
import ViewMode from "../components/ViewMode";
import LayoutSider from "../components/Layout/Sider";
import speces from "../public/assets/speces.json";

const { Header, Content } = Layout;

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
  const [appState, setAppState] = useState({
    theme: "light",
    styleSource: `${process.env.assetPrefix}/assets/light/style.json`,
    checked: false,
  });
  const [isSiderVisible, setIsSiderVisible] = useState(true);
  const [filter, setFilter] = useState(null);
  const [communes, setCommunes] = useState([]);
  const [currentGenre, setCurrentGenre] = useState(null);
  const [activeTab, setActiveTab] = useState("1");

  const onFilterSpecies = (values) => {
    if (!values.length) {
      return setFilter(null);
    }

    setFilter(["in", "genre_latin", ...values]);
  };

  const onViewModeChange = (viewMode) => {
    mapRef.current.map.setLayoutProperty(
      "satellite",
      "visibility",
      viewMode !== "map" ? "none" : "visible"
    );
  };

  const onSearchCityChange = (data) => {
    mapRef.current.map.setZoom(12);
    mapRef.current.map.flyTo({
      center: data.center,
    });

    setPopulation(data.population);
  };

  const onMapClick = (genre) => {
    if (genre) {
      if (isSiderVisible) {
        setIsSiderVisible(false);
      }
      setActiveTab("2");
      setCurrentGenre(genre);
    } else {
      setCurrentGenre(null);
    }
  };

  return (
    <Layout className="etkMainLayout">
      <Header style={themeStyle[appState.theme].header}>
        <Row align="middle">
          <img
            src={`${process.env.assetPrefix}/assets/${appState.theme}/logo.svg`}
            height="40px"
          />
          <Col flex="auto">
            <Row flex="auto" justify="right">
              <Col flex="auto"></Col>
              <Col>
                <Space>
                  <Switch
                    checked={appState.checked}
                    style={{ marginRight: "1rem" }}
                    onChange={(value) => {
                      const theme = value ? "dark" : "light";
                      setAppState({
                        checked: value,
                        theme: theme,
                        styleSource: `${process.env.assetPrefix}/assets/${theme}/style.json`,
                      });
                    }}
                  />
                </Space>
              </Col>
            </Row>
          </Col>
        </Row>
      </Header>
      <Layout>
        <LayoutSider
          width={300}
          collapsed={isSiderVisible}
          theme={appState.theme}
          speces={speces}
          communes={communes}
          activeTab={activeTab}
          currentGenre={currentGenre}
          onFilterSpecies={onFilterSpecies}
          onSearchCityChange={onSearchCityChange}
          onTabChange={setActiveTab}
        />

        <Content style={{ position: "relative" }}>
          <Map
            ref={mapRef}
            styleSource={appState.styleSource}
            filter={filter}
            onMapClick={onMapClick}
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
                setTimeout(() => {
                  window.dispatchEvent(new Event("resize"));
                }, 200);
              }}
            />
          </Tooltip>
          <Affix
            style={{ position: "absolute", left: "1rem", bottom: "1.4rem" }}
          >
            <ViewMode onChange={onViewModeChange} />
          </Affix>

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
