import { FC, useEffect, useState } from "react";
import {
  makeStyles,
  Theme,
  Grid,
  CircularProgress,
  Box,
} from "@material-ui/core";
import { Viewer } from "mapillary-js";
import axios from "axios";
import BrokenImageIcon from "@material-ui/icons/BrokenImage";
import { useTranslation } from "react-i18next";

export type coords = [number, number];

export interface MapillaryImageProps {
  width?: number | string;
  height?: number | string;
  apiClient: string;
  coords?: coords;
}

const useStyles = makeStyles<Theme, MapillaryImageProps>({
  root: {
    width: (props) => props.width || "100%",
    height: (props) => props.height || "200px",
  },
  children: {
    width: "100%",
    height: "200px",
  },
});

const MapillaryImage: FC<MapillaryImageProps> = (props) => {
  const { apiClient, coords } = props;
  const classes = useStyles(props);
  const [viewer, setViewer] = useState(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [currentCoords, setCurrentCords] = useState<coords>(null);
  const [key, setKey] = useState<string>(null);
  const { t } = useTranslation();

  const fetchImages = async (clientId: string, closeTo: coords) => {
    if (Array.isArray(closeTo) && closeTo[0] === undefined) {
      return;
    }

    setLoading(true);

    try {
      if (viewer) {
        viewer.remove();
      }

      const { status, data } = await axios.get(
        "https://a.mapillary.com/v3/images",
        {
          params: {
            client_id: clientId,
            closeto: closeTo,
          },
        }
      );

      if (status === 200 && data.features.length) {
        const newKey = data.features[0].properties.key;

        setKey(newKey);

        const newViewer = new Viewer({
          apiClient,
          container: "mapillary-image",
          imageKey: newKey,
          per_page: 1,
          component: {
            cover: false,
          },
        });

        setViewer(newViewer);
      } else {
        setKey(null);
        setViewer(null);
      }
    } catch (e) {
      setViewer(null);
      setLoading(false);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!currentCoords && coords) {
      setCurrentCords(coords);
      fetchImages(apiClient, coords);
    } else if (
      coords &&
      currentCoords[0] !== coords[0] &&
      currentCoords[1] !== coords[1]
    ) {
      setCurrentCords(coords);
      fetchImages(apiClient, coords);
    }
  }, [coords]);

  return (
    <div id="mapillary-image" className={classes.root}>
      {loading && (
        <Grid
          className={classes.children}
          container
          direction="column"
          justify="center"
          alignItems="center"
        >
          <Grid item>
            <CircularProgress />
          </Grid>
          <Grid item>
            <Box>{t("common.loadingMapillary")}...</Box>
          </Grid>
        </Grid>
      )}
      {!key && !loading && (
        <Grid
          container
          direction="column"
          justify="center"
          alignItems="center"
          className={classes.children}
        >
          <Grid item>
            <BrokenImageIcon fontSize="large" />
          </Grid>
        </Grid>
      )}
    </div>
  );
};

export default MapillaryImage;
