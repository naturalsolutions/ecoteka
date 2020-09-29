import React, {
  useState,
  useRef,
  useEffect,
  forwardRef,
  useImperativeHandle,
} from "react";
import mapboxgl from "mapbox-gl";

export type ETKMapActions = {
  addLayer: () => void;
  setStyle: (style: string) => void;
};

export interface ETKMapProps {
  minZoom?: number;
  maxZoom?: number;
  minPitch?: number;
  mapStyle: string;
  onClick: () => void;
  onStyleData: () => void;
  children: React.ReactNode;
}

export const Map = forwardRef<ETKMapActions, ETKMapProps>(
  ({ mapStyle, children, onClick, onStyleData }, ref) => {
    const mapRef = useRef<HTMLDivElement>(null);
    const [map, setMap] = useState(null);
    const styles = {
      with: "100%",
      height: "100%",
    };

    useEffect(() => {
      if (mapRef.current && !map && typeof window !== "undefined") {
        const newMap = new mapboxgl.Map({
          container: mapRef.current,
          style: mapStyle,
        });

        newMap.on("click", onClick);
        newMap.on("styledata", onStyleData);

        setMap(newMap);
      }
    }, [mapRef]);

    useImperativeHandle(ref, () => ({
      addLayer: () => {
        map.addLayer();
      },
      setStyle: (style: string) => {
        map.setStyle(style);
      },
    }));

    return (
      <div ref={mapRef} style={styles}>
        {children}
      </div>
    );
  }
);

export default Map;
