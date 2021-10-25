import { FC } from "react";
import { IconButton, makeStyles, Theme } from "@material-ui/core";
import { Alert } from "@material-ui/lab";
import PhotoLibraryIcon from "@material-ui/icons/PhotoLibrary";
import StreetviewIcon from "@material-ui/icons/Streetview";
import { useState } from "react";
import MapillaryImage from "@/components/Core/Mapillary/Image";
import TreeImagesGallery from "./Gallery";
import { useTreeContext } from "@/components/Tree/Provider";
import { useInterventionContext } from "@/components/Interventions/Provider";

export interface TreeImagesContainerProps {
  variant?: "panel" | "page";
}

const useStyles = makeStyles<Theme, TreeImagesContainerProps>(
  (theme: Theme) => ({
    root: {
      height: 200,
      background: theme.palette.background.paper,
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
    alert: {
      padding: "1rem",
      position: "absolute",
      bottom: 0,
      left: 0,
      width: "100%",
      zIndex: 101,
    },
    [theme.breakpoints.up("md")]: {
      root: {
        height: ({ variant }) => {
          return variant === "panel" ? 250 : 340;
        },
      },
    },
  })
);

export type Viewer = "images" | "mapillary";

const TreeImagesContainer: FC<TreeImagesContainerProps> = ({
  variant = "panel",
}) => {
  const classes = useStyles({
    variant,
  });
  const [viewer, setViewer] = useState<Viewer>("images");
  const { tree } = useTreeContext();
  const { hasLateInterventions, setHasLateInterventions } =
    useInterventionContext();

  return (
    <div className={classes.root}>
      <div className={classes.viewer}>
        {viewer === "mapillary" ? (
          <MapillaryImage
            apiClient="dDloQllJZFNKNkQ1b1FMZ0ZFNjE3WjozYzk0OTRjM2ZhZjk5ZmUx"
            coords={[tree?.x, tree?.y]}
          />
        ) : (
          <TreeImagesGallery variant={variant} />
        )}
      </div>
      {hasLateInterventions && (
        <div className={classes.alert}>
          <Alert
            severity="warning"
            onClose={() => setHasLateInterventions(false)}
          >
            Une intervention est prévue pour bientôt !
          </Alert>
        </div>
      )}
      <div className={classes.buttons}>
        <div className={classes.buttonsContainer}>
          <IconButton onClick={() => setViewer("images")}>
            <PhotoLibraryIcon />
          </IconButton>
          <IconButton onClick={() => setViewer("mapillary")}>
            <StreetviewIcon />
          </IconButton>
        </div>
      </div>
    </div>
  );
};

export default TreeImagesContainer;
