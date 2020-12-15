import React, { useEffect, useState } from "react";
import {
  makeStyles,
  TableContainer,
  Table,
  TableBody,
  TableRow,
  TableCell,
  Paper,
  Button,
  Avatar,
} from "@material-ui/core";
import { DropzoneArea } from "material-ui-dropzone";
import { useAppLayout } from "@/components/appLayout/Base";
import { apiRest } from "@/lib/api";

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

const useStyles = makeStyles(() => ({
  etkDropzoneText: {
    fontSize: "14px",
    display: "inline-block",
    verticalAlign: "top",
    marginRight: 5,
    minHeight: "auto",
  },
  etkDropzone: {
    marginBottom: 5,
    padding: "0 5px",
    minHeight: "auto",
    "& .MuiDropzonePreviewList-image": {
      objectFit: "cover",
    },
  },
  etkTreeImage: {
    display: "inline-block",
    width: 100,
    height: 100,
    marginRight: 5,
  },
}));

const NB_IMAGES_MAX = 5;

const TreeInfosProperties: React.FC<TreeInfosPropertiesProps> = (props) => {
  const classes = useStyles();
  const id = props.tree?.id;
  const [uploadImages, setUploadImages] = useState<File[]>([]);
  const { snackbar } = useAppLayout();
  const [imagesProgress, setImagesProgress] = useState(0);
  const [isImagesProgress, setIsImagesProgress] = useState(false);
  const [imagesXHR, setImagesXHR] = useState(null);
  const [images, setImages] = useState(null);
  const [imagesDropzoneKey, setImagesDropzoneKey] = useState(0);
  const [imagesReady, setImagesReady] = useState(false);
  const [nbImagesMax, setNbImagesMax] = useState(0);

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
      setImages(null);
      setNbImagesMax(0);
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
      openError("Veuillez sélectionner un fichier");
      return Promise.reject(false);
    }
    snackbar.current.open({
      message: "Envoi en cours...",
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
            message: "Envoi en réussi...",
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

  return props.tree ? (
    <TableContainer component={Paper}>
      <Table size="small">
        <TableBody>
          <TableRow>
            {images?.length > 0 && (
              <TableCell colSpan={2}>
                {images.map((image) => (
                  <Avatar
                    variant="rounded"
                    src={image}
                    className={classes.etkTreeImage}
                  />
                ))}
              </TableCell>
            )}
          </TableRow>
          <TableRow>
            {nbImagesMax > 0 && (
              <TableCell colSpan={2}>
                <DropzoneArea
                  key={imagesDropzoneKey}
                  acceptedFiles={["image/*"]}
                  filesLimit={nbImagesMax}
                  dropzoneText={`Déposer ici les photos ou cliquer (max.${nbImagesMax})`}
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
            Object.keys(props.tree.properties).map((key) => (
              <TableRow key={`psti-${key}`}>
                <TableCell>{key}</TableCell>
                <TableCell>{props.tree.properties[key]}</TableCell>
              </TableRow>
            ))}
        </TableBody>
      </Table>
    </TableContainer>
  ) : null;
};

TreeInfosProperties.defaultProps = defaultProps;

export default TreeInfosProperties;
