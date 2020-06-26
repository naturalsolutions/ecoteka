import { Component } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";

export default class Map extends Component {
  constructor(props) {
    super(props);
    this.map = null;
    this.state = {
      styleSource: props.styleSource,
      lng: 2.54,
      lat: 46.7,
      zoom: 5,
    };
  }

  componentDidMount() {
    this.map = new mapboxgl.Map({
      container: this.mapContainer,
      style: this.state.styleSource,
      center: [this.state.lng, this.state.lat],
      zoom: this.state.zoom,
      filter: this.props.filter,
    });

    this.map.addControl(
      new mapboxgl.GeolocateControl({
        positionOptions: {
          enableHighAccuracy: true,
        },
        trackUserLocation: true,
      })
    );

    this.map.on("click", (e) => this.props.onMapClick(this.map, e));

    if (this.props.onStyleData) {
      this.map.on("styledata", this.props.onStyleData);
    }

    setTimeout(() => {
      window.dispatchEvent(new Event("resize"));
      this.props.onLoaded(this.map);
    }, 200);
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
