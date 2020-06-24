import { Tabs, Layout, Empty } from "antd";
import SearchPanel from "../SearchPanel";

const { TabPane } = Tabs;

export default function LayoutSider(props) {
  return (
    <Layout.Sider
      theme={props.theme}
      collapsed={props.collapsed}
      collapsedWidth={0}
      width={props.width}
    >
      <Tabs type="card" size="small" defaultActiveKey="1">
        <TabPane tab="Search" key="1" style={{ padding: "0 1rem" }}>
          <SearchPanel
            speces={props.speces}
            communes={props.communes}
            onSearchCityChange={props.onSearchCityChange}
            onFilterSpecies={props.onFilterSpecies}
          ></SearchPanel>
        </TabPane>
        <TabPane tab="Info" key="2">
          <Empty />
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
