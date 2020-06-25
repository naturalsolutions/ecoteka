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

    if (props.onStyleDataLoaded) {
      this.onStyleDataLoaded = props.onStyleDataLoaded;
    }
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

    this.map.on("click", this.onMapClick.bind(this));

    setTimeout(() => {
      window.dispatchEvent(new Event("resize"));
    }, 200);
  }

  componentDidUpdate(prevProps) {
    if (prevProps.styleSource !== this.props.styleSource) {
      this.map.setStyle(this.props.styleSource);
      setTimeout(() => {
        this.map.setFilter("arbres", this.props.filter);
      }, 200);
    }

    if (prevProps.filter !== this.props.filter) {
      this.map.setFilter("arbres", this.props.filter);
    }
  }

  onMapClick(e) {
    const bbox = [
      [e.point.x - 5, e.point.y - 5],
      [e.point.x + 5, e.point.y + 5],
    ];

    var features = this.map.queryRenderedFeatures(bbox);

    if (features.length) {
      const feature = features.pop();
      let genre = null;

      if (feature.properties.genre_latin) {
        genre = feature.properties.genre_latin.toLowerCase().replace(" ", "_");
      }

      if (feature.properties.genre) {
        genre = feature.properties.genre.toLowerCase().replace(" ", "_");
      }

      this.props.onMapClick(genre, feature.properties);
    } else {
      this.props.onMapClick(null, null);
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
