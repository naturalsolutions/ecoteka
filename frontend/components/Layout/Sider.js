import { Tabs, Layout, Empty } from "antd";
import SearchPanel from "../SearchPanel";
import Wikipedia from "../Wikipedia";
import Properties from "../Properties";

const { TabPane } = Tabs;

export default function LayoutSider(props) {
  return (
    <Layout.Sider
      theme={props.theme}
      collapsed={props.collapsed}
      collapsedWidth={0}
      width={props.width}
      style={{ height: "calc(100vh - 50px)" }}
    >
      <Tabs
        type="card"
        size="small"
        defaultActiveKey="1"
        activeKey={props.activeTab}
        style={{ height: "100%" }}
        onChange={props.onTabChange}
      >
        <TabPane tab="Search" key="1" style={{ padding: "0 1rem" }}>
          <SearchPanel
            speces={props.speces}
            communes={props.communes}
            theme={props.theme}
            onSearchCityChange={props.onSearchCityChange}
            onFilterSpecies={props.onFilterSpecies}
          ></SearchPanel>
        </TabPane>
        <TabPane tab="Wikipedia" key="2">
          <Wikipedia theme={props.theme} genre={props.currentGenre} />
        </TabPane>
        <TabPane tab="Properties" key="3" style={{ padding: "0 1rem" }}>
          <Properties theme={props.theme} properties={props.currentProperties} />
        </TabPane>
      </Tabs>
    </Layout.Sider>
  );
}
