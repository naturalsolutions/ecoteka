import { Empty, Descriptions } from "antd";

export default function Properties(props) {
  function onThemeChange(theme) {
    return theme === 'light' ? null : { color: 'white' }
  }

  return props.properties ? (
    <Descriptions bordered size="small" column={1}>
      {Object.keys(props.properties).map((property) => {
        return (
          <Descriptions.Item label={property} key={property}>
            <span style={onThemeChange(props.theme)}>{props.properties[property]}</span>
          </Descriptions.Item>
        );
      })}
    </Descriptions>
  ) : (
      <Empty style={onThemeChange(props.theme)} />
    );
}
