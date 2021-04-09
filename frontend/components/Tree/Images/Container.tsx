import { FC, useMemo } from "react";
import { IconButton, makeStyles, Theme } from "@material-ui/core";
import PhotoLibraryIcon from "@material-ui/icons/PhotoLibrary";
import StreetviewIcon from "@material-ui/icons/Streetview";
import { useState } from "react";
import MapillaryImage from "@/components/Core/Mapillary/Image";
import { Tree } from "@/index";
import TreeImagesGallery from "./Gallery";

export interface TreeImagesContainerProps {
  tree: Tree;
  variant?: "panel" | "page";
}

const useStyles = makeStyles<Theme, TreeImagesContainerProps>(
  (theme: Theme) => ({
    root: {
      height: 200,
      [theme.breakpoints.up("md")]: {
        height: ({ variant }) => {
          return variant === "panel" ? 250 : 340;
        },
      },
      background: theme.palette.background.default,
      position: "relative",
    },
    buttons: {
      position: "absolute",
      right: 0,
      top: 0,
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      height: "100%",
      zIndex: 100,
    },
    buttonsContainer: {
      display: "flex",
      flexDirection: "column",
      background: theme.palette.background.paper,
      borderTopLeftRadius: 5,
      borderBottomLeftRadius: 5,
      padding: 1,
    },
    viewer: {
      width: "100%",
      height: "100%",
    },
  })
);

export type Viewer = "images" | "mapillary";

const TreeImagesContainer: FC<TreeImagesContainerProps> = ({
  tree,
  variant = "panel",
}) => {
  const classes = useStyles({
    tree,
    variant,
  });
  const [viewer, setViewer] = useState<Viewer>("mapillary");

  return (
    <div className={classes.root}>
      <div className={classes.viewer}>
        {viewer === "mapillary" ? (
          <MapillaryImage
            apiClient="dDloQllJZFNKNkQ1b1FMZ0ZFNjE3WjozYzk0OTRjM2ZhZjk5ZmUx"
            coords={[tree?.x, tree?.y]}
          />
        ) : (
          <TreeImagesGallery tree={tree} variant={variant} />
        )}
      </div>
      <div className={classes.buttons}>
        <div className={classes.buttonsContainer}>
          <IconButton onClick={() => setViewer("mapillary")}>
            <StreetviewIcon />
          </IconButton>
          <IconButton onClick={() => setViewer("images")}>
            <PhotoLibraryIcon />
          </IconButton>
        </div>
      </div>
    </div>
  );
};

export default TreeImagesContainer;
