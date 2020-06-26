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
import layers from "../public/assets/layers.json";

export default () => {
  const mapRef = createRef();
  const [appState, setAppState] = useState({
    theme: "light",
    styleSource: `${process.env.assetPrefix}/assets/light/style.json`,
  });
  const [isSiderCollapsed, setIsSiderCollapsed] = useState(true);
  const [filter, setFilter] = useState(null);
  const [currentGenre, setCurrentGenre] = useState(null);
  const [currentProperties, setCurrentProperties] = useState(null);
  const [activeTab, setActiveTab] = useState("1");

  const onFilterSpecies = (values) => {
    if (!values.length) {
      return setFilter(null);
    }

    setFilter([
      "all",
      ["in", "genre_latin", ...values],
      ["in", "genre", ...values],
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

  const onMapClick = (e) => {
    const bbox = [
      [e.point.x - 5, e.point.y - 5],
      [e.point.x + 5, e.point.y + 5],
    ];

    var features = mapRef.current.map.queryRenderedFeatures(bbox, {
      layers: layers,
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
    const theme = darkTheme ? "dark" : "light";
    const newAppState = {
      theme: theme,
      styleSource: `${process.env.assetPrefix}/assets/${theme}/style.json`,
    };

    mapRef.current.map.setStyle(newAppState.styleSource);
    setAppState(newAppState);
  };

  const onLayoutSiderToggle = () => {
    setIsSiderCollapsed(!isSiderCollapsed);
    setTimeout(() => {
      window.dispatchEvent(new Event("resize"));
    }, 200);
  };

  const onMapLoaded = (map) => {
    for (const layer of layers) {
      map.addLayer({
        id: layer,
        type: "circle",
        source: "ales",
        "source-layer": layer,
        paint: themeStyle(appState.theme).circlePaint,
      });
    }
  };

  return (
    <LayoutBase
      header={
        <LayoutHeader
          themeStyle={themeStyle(appState.theme).header}
          logo={`${process.env.assetPrefix}/assets/${appState.theme}/logo.svg`}
          onDarkThemeChange={onLayoutHeaderDarkThemeChange}
        />
      }
      sider={
        <LayoutSider
          width={300}
          collapsed={isSiderCollapsed}
          theme={appState.theme}
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
        styleSource={appState.styleSource}
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
