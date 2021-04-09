import React, { useEffect, useMemo } from "react";
import { makeStyles } from "@material-ui/core";
import MapillaryImage from "@/components/Core/Mapillary/Image";
import { Tree } from "@/index";

export interface ITreeMapillaryProps {
  tree: Tree;
}

const useStyles = makeStyles(() => ({
  root: {},
}));

const TreeMapillary: React.FC<ITreeMapillaryProps> = ({ tree }) => {
  const classes = useStyles();

  return (
    <div style={{ height: "100%", width: "100%" }}>
      <MapillaryImage
        apiClient="dDloQllJZFNKNkQ1b1FMZ0ZFNjE3WjozYzk0OTRjM2ZhZjk5ZmUx"
        coords={[tree?.x, tree?.y]}
      />
    </div>
  );
};

export default TreeMapillary;
