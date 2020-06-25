import { Empty, Descriptions } from "antd";

export default function Properties(props) {
  return props.properties ? (
    <Descriptions bordered size="small" column={1}>
      {Object.keys(props.properties).map((property) => {
        return (
          <Descriptions.Item label={property}>
            {props.properties[property]}
          </Descriptions.Item>
        );
      })}
    </Descriptions>
  ) : (
    <Empty />
  );
}
