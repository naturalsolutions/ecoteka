import { useEffect, useState, FC } from "react";
import {
  makeStyles,
  Theme,
  Grid,
  Fab,
  MobileStepper,
  Button,
} from "@material-ui/core";
import { Tree } from "@/index";
import useApi from "@/lib/useApi";
import { useAppContext } from "@/providers/AppContext";
import TreeImagesUpload from "./Upload";
import SwipeableViews from "react-swipeable-views";
import {
  DeleteForever,
  KeyboardArrowLeft,
  KeyboardArrowRight,
} from "@material-ui/icons";
import { useAppLayout } from "@/components/AppLayout/Base";
import { useTranslation } from "react-i18next";

export type TreeImagesGalleryVariant = "panel" | "page";

export interface TreeImagesGalleryProps {
  tree: Tree;
  variant?: TreeImagesGalleryVariant;
}

const useStyles = makeStyles<Theme, { variant: TreeImagesGalleryVariant }>(
  (theme: Theme) => ({
    root: {
      height: "100%",
      width: "100%",
    },
    image: {
      height: 155,
      [theme.breakpoints.up("md")]: {
        height: ({ variant }) => (variant === "panel" ? 155 : 255),
      },
      display: "block",
      overflow: "hidden",
      width: "100%",
      objectFit: "contain",
    },
  })
);

const TreeImagesGallery: FC<TreeImagesGalleryProps> = ({
  tree,
  variant = "panel",
}) => {
  const classes = useStyles({ variant });
  const { apiETK } = useApi().api;
  const { organization } = useAppContext();
  const [images, setImages] = useState([]);
  const { snackbar, dialog } = useAppLayout();
  const { t } = useTranslation();

  const [index, setIndex] = useState<number>(0);

  const fetchImages = async () => {
    try {
      const { status, data } = await apiETK.get(
        `/organization/${organization.id}/trees/${tree.id}/images`
      );

      if (status === 200) {
        setImages(data);
        setIndex(0);
      }
    } catch (e) {}
  };

  const handlePrevStep = () => {
    setIndex(index - 1);
  };

  const handleNextStep = () => {
    setIndex(index + 1);
  };

  const handleRemove = (image, imageIndex) => {
    dialog.current.open({
      title: t("common.permanentDeletion"),
      content: t("common.confirmContinue"),
      actions: [
        {
          label: t("common.yes"),
          variant: "text",
          size: "large",
          onClick: async () => {
            try {
              const newImages = [...images];

              newImages.splice(imageIndex, 1);

              if (index > 0) {
                handlePrevStep();
              }

              setImages(newImages);

              const filename = (image.match(/[^\\/]+\.[^\\/]+$/) || []).pop();
              const url = `/organization/${organization.id}/trees/${tree.id}/images/${filename}`;
              await apiETK.delete(url);
            } catch (e) {}
          },
        },
        {
          label: t("common.no"),
          color: "primary",
          variant: "text",
          size: "large",
        },
      ],
    });
  };

  useEffect(() => {
    fetchImages();
  }, [tree?.id]);

  return (
    <Grid container className={classes.root}>
      {images.length > 0 ? (
        <Grid item xs>
          <SwipeableViews
            index={index}
            onChangeIndex={(newIndex) => setIndex(newIndex)}
            enableMouseEvents
          >
            {images.map((image, imageIndex) => (
              <div
                key={image + imageIndex}
                style={{
                  position: "relative",
                }}
              >
                <Fab
                  size="small"
                  color="primary"
                  onClick={() => {
                    handleRemove(image, imageIndex);
                  }}
                >
                  <DeleteForever />
                </Fab>
                <img className={classes.image} src={image} />
              </div>
            ))}
          </SwipeableViews>
          <MobileStepper
            steps={images.length}
            position="static"
            activeStep={index}
            nextButton={
              <Button
                size="small"
                onClick={handleNextStep}
                disabled={index === images.length - 1}
              >
                <KeyboardArrowRight />
              </Button>
            }
            backButton={
              <Button
                size="small"
                onClick={handlePrevStep}
                disabled={index === 0}
              >
                <KeyboardArrowLeft />
              </Button>
            }
          />
        </Grid>
      ) : (
        <TreeImagesUpload treeId={tree?.id} onChange={() => fetchImages()} />
      )}
    </Grid>
  );
};

export default TreeImagesGallery;
