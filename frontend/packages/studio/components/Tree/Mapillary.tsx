import React from "react";
import { makeStyles } from "@material-ui/core";
import MapillaryImage from "@/components/Core/Mapillary/Image";
import { Tree } from "@/index";
import { useMemo } from "react";
import getConfig from "next/config";

export interface ITreeMapillaryProps {
  tree: Tree;
}

const useStyles = makeStyles(() => ({
  root: {},
}));

const TreeMapillary: React.FC<ITreeMapillaryProps> = ({ tree }) => {
  const classes = useStyles();
  const { publicRuntimeConfig } = getConfig();
  const { mapillaryApiClient } = publicRuntimeConfig;

  return useMemo(
    () => (
      <div style={{ minHeight: "300px", height: "300px", width: "100%" }}>
        <MapillaryImage
          apiClient={mapillaryApiClient}
          coords={[tree?.x, tree?.y]}
        />
      </div>
    ),
    [tree]
  );
};

export default TreeMapillary;
