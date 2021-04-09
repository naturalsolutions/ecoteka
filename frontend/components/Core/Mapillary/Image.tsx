import { FC, useEffect, useState } from "react";
import { makeStyles, Theme } from "@material-ui/core";
import { Viewer } from "mapillary-js";
import axios from "axios";
import { Skeleton } from "@material-ui/lab";

export type coords = [number, number];

export interface IMapillaryImageProps {
  width?: number | string;
  height?: number | string;
  apiClient: string;
  coords?: coords;
}

const useStyles = makeStyles<Theme, IMapillaryImageProps>({
  root: {
    width: (props) => props.width || "100%",
    height: (props) => props.height || "100%",
  },
});

const MapillaryImage: FC<IMapillaryImageProps> = (props) => {
  const { apiClient, coords } = props;
  const classes = useStyles(props);
  const [viewer, setViewer] = useState(null);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchImages = async () => {
    setLoading(true);
    try {
      const { status, data } = await axios.get(
        "https://a.mapillary.com/v3/images",
        {
          params: {
            client_id: apiClient,
            closeto: coords,
          },
        }
      );

      if (status === 200 && data.features.length) {
        const newViewer = new Viewer({
          apiClient,
          container: "mapillary-image",
          imageKey: data.features[0].properties.key,
          per_page: 1,
        });

        setLoading(false);
        setViewer(newViewer);
      }
    } catch (e) {
      if (viewer?.remove) {
        // viewer.remove();
      }

      setViewer(null);
      setLoading(false);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (coords[0]) {
      fetchImages();
    }
  }, [coords]);

  return <div id="mapillary-image" style={{ width: "100%", height: "100%" }} />;
};

export default MapillaryImage;
