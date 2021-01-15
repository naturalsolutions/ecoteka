import React, { Fragment, useEffect, useState } from "react";
import {
  makeStyles,
  TableContainer,
  Table,
  TableBody,
  TableRow,
  TableCell,
  Paper,
  Button,
  MobileStepper,
  Fab,
} from "@material-ui/core";
import { DropzoneArea } from "material-ui-dropzone";
import { useAppLayout } from "@/components/AppLayout/Base";
import { apiRest } from "@/lib/api";
import SwipeableViews from "react-swipeable-views";
import {
  DeleteForever,
  KeyboardArrowLeft,
  KeyboardArrowRight,
} from "@material-ui/icons";
import { useTranslation } from "react-i18next";

export interface TreeInfosPropertiesProps {
  tree: {
    id: number;
    x: number;
    y: number;
    properties: object;
    organization_id: number;
  };
}

const defaultProps: TreeInfosPropertiesProps = {
  tree: undefined,
};

const useStyles = makeStyles((theme) => ({
  etkDropzone: {
    marginBottom: 5,
    padding: "0 5px",
    minHeight: "auto",
    "& .MuiDropzoneArea-textContainer": {
      display: "flex",
      alignItems: "center",
      "& .MuiDropzoneArea-icon": {
        color: theme.palette.primary.main,
      },
    },
    "& .MuiDropzonePreviewList-image": {
      objectFit: "cover",
    },
  },
  etkDropzoneText: {
    fontSize: "18px",
    margin: "7px 5px 8px 5px",
    textAlign: "left",
  },
  etkTreeSliderImage: {
    height: 255,
    display: "block",
    overflow: "hidden",
    width: "100%",
    objectFit: "contain",
  },
  etkRemoveSlide: {
    position: "absolute",
    top: 5,
    right: 5,
  },
}));

const NB_IMAGES_MAX = 6;

const TreeInfosProperties: React.FC<TreeInfosPropertiesProps> = (props) => {
  const classes = useStyles();
  const id = props.tree?.id;
  const [uploadImages, setUploadImages] = useState<File[]>([]);
  const { snackbar, dialog } = useAppLayout();
  const [imagesProgress, setImagesProgress] = useState(0);
  const [isImagesProgress, setIsImagesProgress] = useState(false);
  const [imagesXHR, setImagesXHR] = useState(null);
  const [images, setImages] = useState(null);
  const [imagesDropzoneKey, setImagesDropzoneKey] = useState(0);
  const [nbImagesMax, setNbImagesMax] = useState(0);
  const { t } = useTranslation(["common", "components"]);

  const [imagesActiveIndex, setImagesActiveIndex] = React.useState(0);

  const handleNext = () => {
    setImagesActiveIndex((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setImagesActiveIndex((prevActiveStep) => prevActiveStep - 1);
  };

  const handleStepChange = (step: number) => {
    setImagesActiveIndex(step);
  };

  const getImages = async () => {
    const response = await apiRest.trees.getImages(
      props.tree.organization_id,
      id
    );
    setImages(response);
    setNbImagesMax(NB_IMAGES_MAX - response.length);
  };

  useEffect(() => {
    if (id) {
      setNbImagesMax(0);
      setImages(null);
      setImagesActiveIndex(0);
      getImages();
      setImagesDropzoneKey(imagesDropzoneKey + 1);
    }
  }, [id]);

  const openError = (message: string) => {
    snackbar.current.open({
      message: message,
      severity: "error",
    });
  };

  const onUploadProgress = (e) => {
    const progress = (e.loaded / e.total) * 100;
    setImagesProgress(progress);
  };

  const sendImages = () => {
    if (!uploadImages.length) {
      openError(t("common:errors.fileRequired"));
      return Promise.reject(false);
    }
    snackbar.current.open({
      message: t("common:messages.sending"),
    });

    let newXHR = apiRest.trees.postImages(
      props.tree.organization_id,
      props.tree.id,
      uploadImages,
      {
        onProgress: onUploadProgress,
        onLoad: (cXHR) => {
          setImagesDropzoneKey(imagesDropzoneKey + 1);
          setIsImagesProgress(false);
          setImagesXHR(null);

          if (cXHR.status !== 200) {
            openError(cXHR.response);
            return;
          }
          snackbar.current.open({
            message: t("common:messages.success"),
            autoHideDuration: 2000,
          });

          getImages();
        },
        onError: (cXHR) => {
          setImagesDropzoneKey(imagesDropzoneKey + 1);
          const response = JSON.parse(cXHR.response);

          openError(response.detail);
          setIsImagesProgress(false);
          setImagesXHR(null);
        },
      }
    );

    setImagesXHR(newXHR);
    setIsImagesProgress(true);
  };

  const removeImage = (image, index) => {
    dialog.current.open({
      title: t("common:permanentDeletion"),
      content: t("common:confirmContinue"),
      actions: [
        {
          label: t("common:yes"),
          variant: "text",
          size: "large",
          onClick: () => {
            images.splice(index, 1);
            setImages([...images]);
            setNbImagesMax(NB_IMAGES_MAX - images.length);
            if (imagesActiveIndex > images.length - 1) {
              setImagesActiveIndex(images.length - 1);
            }
            apiRest.trees.deleteImage(props.tree.organization_id, id, image);
          },
        },
        {
          label: t("common:no"),
          color: "primary",
          variant: "text",
          size: "large",
        },
      ],
    });
  };

  return props.tree ? (
    <Fragment>
      {images?.length > 0 && (
        <Paper
          style={{
            marginBottom: 10,
          }}
        >
          {/* <TableRow>
            {images?.length > 0 && (
              <TableCell colSpan={2}>
                {images?.map((image) => (
                  <Avatar
                    variant="rounded"
                    src={image}
                    className={classes.etkTreeImage}
                  />
                ))}
              </TableCell>
            )}
          </TableRow> */}
          <SwipeableViews
            index={imagesActiveIndex}
            onChangeIndex={handleStepChange}
            enableMouseEvents
          >
            {images?.map((image, index) => (
              <div
                key={image + index}
                style={{
                  position: "relative",
                }}
              >
                <Fab
                  className={classes.etkRemoveSlide}
                  size="small"
                  color="primary"
                  onClick={() => {
                    removeImage(image, index);
                  }}
                >
                  <DeleteForever />
                </Fab>
                <img className={classes.etkTreeSliderImage} src={image} />
              </div>
            ))}
          </SwipeableViews>
          <MobileStepper
            steps={images?.length}
            position="static"
            variant="text"
            activeStep={imagesActiveIndex}
            nextButton={
              <Button
                size="small"
                onClick={handleNext}
                disabled={imagesActiveIndex === images?.length - 1}
              >
                <KeyboardArrowRight />
              </Button>
            }
            backButton={
              <Button
                size="small"
                onClick={handleBack}
                disabled={imagesActiveIndex === 0}
              >
                <KeyboardArrowLeft />
              </Button>
            }
          />
        </Paper>
      )}
      <TableContainer component={Paper}>
        <Table size="small">
          <TableBody>
            <TableRow>
              {nbImagesMax > 0 && (
                <TableCell colSpan={2}>
                  <DropzoneArea
                    key={imagesDropzoneKey}
                    acceptedFiles={["image/*"]}
                    filesLimit={nbImagesMax}
                    dropzoneText={t("components:TreeForm.imagesUpload.select", {
                      max: nbImagesMax,
                    })}
                    showAlerts={["error"]}
                    onChange={(files) => {
                      setUploadImages(files);
                    }}
                    previewGridProps={{
                      container: {
                        spacing: 1,
                      },
                    }}
                    dropzoneClass={classes.etkDropzone}
                    dropzoneParagraphClass={classes.etkDropzoneText}
                  />
                  {uploadImages.length > 0 && (
                    <Button
                      fullWidth
                      variant="contained"
                      color="primary"
                      onClick={() => {
                        sendImages();
                      }}
                    >
                      Envoyer les photos
                    </Button>
                  )}
                </TableCell>
              )}
            </TableRow>
            <TableRow>
              <TableCell>Lat</TableCell>
              <TableCell>{props.tree.x}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Lng</TableCell>
              <TableCell>{props.tree.y}</TableCell>
            </TableRow>
            {props.tree.properties &&
              Object.keys(props.tree.properties).map((key) => { 
                const labels = t("components:Tree.properties", {​​ returnObjects: true }​​)                return (
                <TableRow key={`psti-${key}`}>
                  <TableCell>{​​labels[key]}​​​​</TableCell>
                  <TableCell>{props.tree.properties[key]}</TableCell>
                </TableRow>
              )})
          </TableBody>
        </Table>
      </TableContainer>
    </Fragment>
  ) : null;
};

TreeInfosProperties.defaultProps = defaultProps;

export default TreeInfosProperties;
