import { Component } from "react";
import mapboxgl from "maplibre-gl";

export interface ETKMapProps {
  styleSource: string;
  onStyleData?(map: mapboxgl.Map): void;
  onMapClick?(map: mapboxgl.Map, event: Event): void;
}

export default class ETKMap extends Component<
  ETKMapProps,
  {
    zoom: number;
    lng: number;
    lat: number;
    styleSource: string;
  }
> {
  public map: mapboxgl.Map;
  private mapContainer: HTMLElement;

  constructor(props: ETKMapProps) {
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
    });

    const geolocate = new mapboxgl.GeolocateControl({
      positionOptions: {
        enableHighAccuracy: true,
      },
      trackUserLocation: true,
    });

    this.map.geolocate = geolocate;
    this.map.addControl(geolocate);

    if (this.props.onStyleData) {
      this.map.once("styledata", () => {
        this.props.onStyleData(this.map);
      });
    }
  }

  render() {
    return <div ref={(el) => (this.mapContainer = el)} className="etk-map" />;
  }
}
