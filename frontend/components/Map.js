import { Component } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";

export default class Map extends Component {
  constructor(props) {
    super(props);
    this.map = null;
    this.state = {
      lng: 2.54,
      lat: 46.7,
      zoom: 5,
    };

    if (props.onStyleDataLoaded) {
      this.onStyleDataLoaded = props.onStyleDataLoaded;
    }
  }

  componentDidMount() {
    this.map = new mapboxgl.Map({
      container: this.mapContainer,
      style: this.props.styleSource,
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

    this.map.on("styledata", this.onStyleData.bind(this));
  }

  componentDidUpdate(prevProps) {
    if (prevProps.styleSource !== this.props.styleSource) {
      this.map.setStyle(this.props.styleSource);
    }

    if (prevProps.filter !== this.props.filter) {
      this.map.setFilter("arbres", this.props.filter);
    }

    this.map.on("styledata", () => {
      this.map.setFilter("arbres", this.props.filter);
    });
  }

  onStyleData() {
    if (this.props.onStyleData) {
      this.props.onStyleData();
    }

    window.dispatchEvent(new Event("resize"));
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
