import { Component } from "react";
import mapboxgl from "mapbox-gl";

export default class ETKMap extends Component {
  constructor(props) {
    super(props);
    this.map = null;
    this.geolocate = null;
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

    this.geolocate = new mapboxgl.GeolocateControl({
      positionOptions: {
        enableHighAccuracy: true,
      },
      trackUserLocation: true,
    });
    this.geolocate.on('geolocate', (e) => {
      if (this.props.onGeolocate) {
        this.props.onGeolocate(e);
      }
    })

    this.map.addControl(this.geolocate);
    this.map.on("click", (e) => this.props.onMapClick(this.map, e));

    if (this.props.onStyleData) {
      this.map.once("styledata", () => {
        this.props.onStyleData();
      });
    }

    window.addEventListener("orientationchange", (e) => {
      setTimeout(() => {
        window.dispatchEvent(new Event("resize"));
      }, 200);
    });
  }

  render() {
    return <div ref={(el) => (this.mapContainer = el)} className="etk-map" />;
  }
}
