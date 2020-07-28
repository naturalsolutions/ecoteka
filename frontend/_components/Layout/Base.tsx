import { Layout } from "antd";
import { ReactNode } from "react";

const { Content } = Layout;

export interface LayoutBaseProps {
  header: ReactNode;
  sider: ReactNode;
  children?: ReactNode;
}

const LayoutBase: React.FC<LayoutBaseProps> = (props) => {
  return (
    <Layout className="etk-layout-base">
      {props.header}
      <Layout>
        {props.sider}
        <Content style={{ position: "relative" }}>{props.children}</Content>
      </Layout>
    </Layout>
  );
};

export default LayoutBase;
