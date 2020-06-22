import { Component } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";

export default class Map extends Component {
  constructor(props) {
    super(props);
    this.map = null;
    this.state = {
      style: props.style,
      lng: 2.54,
      lat: 46.7,
      zoom: 3,
    };
  }

  componentDidMount() {
    this.map = new mapboxgl.Map({
      container: this.mapContainer,
      style: this.state.style,
      center: [this.state.lng, this.state.lat],
      zoom: this.state.zoom,
    });
  }

  componentDidUpdate(nextProps) {
    const { style } = this.props;

    if (nextProps.style !== style) {
      this.setState({
        style: nextProps.style,
      });

      this.map.setStyle(this.state.style);
    }
  }

  render() {
    return (
      <div
        ref={(el) => (this.mapContainer = el)}
        style={{
          width: "100%",
          height: "100%",
        }}
      />
    );
  }
}
