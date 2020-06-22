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
      zoom: 5,
      filter: props.filter,
    };
  }

  componentDidMount() {
    this.map = new mapboxgl.Map({
      container: this.mapContainer,
      style: this.state.style,
      center: [this.state.lng, this.state.lat],
      zoom: this.state.zoom,
      filter: this.state.filter,
    });

    this.map.addControl(
      new mapboxgl.GeolocateControl({
        positionOptions: {
          enableHighAccuracy: true,
        },
        trackUserLocation: true,
      })
    );

    this.map.on("styledata", this.onStyleData.bind(this));
  }

  componentDidUpdate(prevProps) {
    if (prevProps.style !== this.props.style) {
      this.map.setStyle(this.props.style);
    }

    if (prevProps.filter !== this.props.filter) {
      for (let filter of this.props.filter) {
        this.map.setFilter("arbres", filter);
      }
    }
  }

  onStyleData() {
    if (this.props.filter) {
      this.map.setFilter("arbres", this.props.filter);
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
