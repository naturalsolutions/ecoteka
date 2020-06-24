import { Tabs, Layout, Empty } from "antd";
import SearchPanel from "../SearchPanel";
import Wikipedia from "../Wikipedia";

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
      >
        <TabPane tab="Search" key="1" style={{ padding: "0 1rem" }}>
          <SearchPanel
            speces={props.speces}
            communes={props.communes}
            onSearchCityChange={props.onSearchCityChange}
            onFilterSpecies={props.onFilterSpecies}
          ></SearchPanel>
        </TabPane>
        <TabPane tab="Info" key="2">
          <Wikipedia genre={props.currentGenre} />
        </TabPane>
        <TabPane tab="City" key="3">
          <Empty />
        </TabPane>
        <TabPane tab="Layers" key="4">
          <Empty />
        </TabPane>
      </Tabs>
    </Layout.Sider>
  );
}
