import { useState, createRef, useEffect } from "react";
import { Button, Affix } from "antd";
import Map from "../components/Map";
import ButtonAbout from "../components/ButtonAbout";
import ViewMode from "../components/ViewMode";
import LayoutBase from "../components/Layout/Base";
import LayoutHeader from "../components/Layout/Header";
import LayoutSider from "../components/Layout/Sider";
import LayoutSiderToggle from "../components/Layout/SiderToggle";
import themeStyle from "../lib/themeStyle";
import speces from "../public/assets/speces.json";
import layersStyle from "../public/assets/layersStyle.json";

export default () => {
  const mapRef = createRef();
  const [theme, setTheme] = useState("light");
  const [isSiderCollapsed, setIsSiderCollapsed] = useState(true);
  const [filter, setFilter] = useState(null);
  const [currentGenre, setCurrentGenre] = useState(null);
  const [currentProperties, setCurrentProperties] = useState(null);
  const [activeTab, setActiveTab] = useState("1");

  const onFilterSpecies = (values) => {
    if (!values.length) {
      mapRef.current.map.setFilter("ecoteka-data", null);
      return;
    }

    mapRef.current.map.setFilter("ecoteka-data", [
      "in",
      "genre_latin",
      ...values,
    ]);
  };

  const onViewModeChange = (viewMode) => {
    mapRef.current.map.setLayoutProperty(
      "satellite",
      "visibility",
      viewMode === "map" ? "none" : "visible"
    );
  };

  const onSearchCityChange = (data) => {
    mapRef.current.map.setZoom(12);
    mapRef.current.map.flyTo({
      center: data.center,
    });
  };

  const onMapClick = (map, e) => {
    const bbox = [
      [e.point.x - 5, e.point.y - 5],
      [e.point.x + 5, e.point.y + 5],
    ];

    var features = map.queryRenderedFeatures(bbox, {
      layers: ["ecoteka-data"],
    });

    if (features.length) {
      const feature = features.pop();
      let genre = null;

      if (feature.properties.genre_latin) {
        genre = feature.properties.genre_latin.toLowerCase().replace(" ", "_");
      }

      if (feature.properties.genre) {
        genre = feature.properties.genre.toLowerCase().replace(" ", "_");
      }

      if ((genre || feature.properties) && isSiderCollapsed) {
        setIsSiderCollapsed(false);
      }

      setCurrentGenre(genre);
      setCurrentProperties(feature.properties);

      if (feature.properties) {
        setActiveTab("3");
      }
    }
  };

  const onLayoutHeaderDarkThemeChange = (darkTheme) => {
    const newTheme = darkTheme ? "dark" : "light";

    for (let layer of Object.keys(layersStyle)) {
      for (let property of Object.keys(layersStyle[layer][newTheme])) {
        mapRef.current.map.setPaintProperty(
          layer,
          property,
          layersStyle[layer][newTheme][property]
        );
      }
    }

    setTheme(newTheme);
  };

  const onLayoutSiderToggle = () => {
    setIsSiderCollapsed(!isSiderCollapsed);
    setTimeout(() => {
      window.dispatchEvent(new Event("resize"));
    }, 200);
  };

  const onMapLoaded = (map) => {
    onLayoutHeaderDarkThemeChange(false);
  };

  return (
    <LayoutBase
      header={
        <LayoutHeader
          themeStyle={themeStyle(theme).header}
          logo={`${process.env.assetPrefix}/assets/${theme}/logo.svg`}
          onDarkThemeChange={onLayoutHeaderDarkThemeChange}
        />
      }
      sider={
        <LayoutSider
          width={300}
          collapsed={isSiderCollapsed}
          theme={theme}
          speces={speces}
          activeTab={activeTab}
          currentGenre={currentGenre}
          currentProperties={currentProperties}
          onFilterSpecies={onFilterSpecies}
          onSearchCityChange={onSearchCityChange}
          onTabChange={setActiveTab}
        />
      }
    >
      <Map
        ref={mapRef}
        styleSource="/assets/style.json"
        filter={filter}
        onMapClick={onMapClick}
        onLoaded={onMapLoaded}
      />
      <LayoutSiderToggle onToggle={onLayoutSiderToggle} />
      <Affix style={{ position: "absolute", left: "1rem", bottom: "1.4rem" }}>
        <ViewMode onChange={onViewModeChange} />
      </Affix>
      <ButtonAbout />
    </LayoutBase>
  );
};
