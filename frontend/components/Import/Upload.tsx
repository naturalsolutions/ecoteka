import React, { useState, useEffect } from "react";
import { makeStyles, createStyles, withStyles } from "@material-ui/core/styles";
import { Tooltip, Box, Grid } from "@material-ui/core";
import HelpIcon from "@material-ui/icons/Help";
import Divider from "@material-ui/core/Divider";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import { DropzoneArea } from "material-ui-dropzone";
import GetAppIcon from "@material-ui/icons/GetApp";
import ErrorIcon from "@material-ui/icons/Error";
import ETKProgressBar from "./ProgressBar";
import getConfig from "next/config";
import Geofile from "../Geofile";
import { apiRest } from "../../lib/api";

const { publicRuntimeConfig } = getConfig();

export interface ETKUploadProps {
  uploadUrl?: string;
  geofile?: Geofile;
  tooltipcontent: [string];
  extensionsFileAccepted: [string];
  dropzoneText: string;
  missingInfo?: [string?];
  step?: string;
  boxContent?: string;
  fileListHint?: string;
  buttonCancelContent?: string;
  buttonUploadContent?: string;
  onUploadProgress?(progress: number): void;
  onUploaded?(geofile: Geofile): void;
}

const defaultProps: ETKUploadProps = {
  uploadUrl: `${publicRuntimeConfig.apiUrl}/geo_files/upload`,
  geofile: undefined,
  tooltipcontent: [""],
  extensionsFileAccepted: [""],
  dropzoneText: "",
  missingInfo: [""],
  step: "start",
  boxContent: "Importez vos données",
  fileListHint: "Types de fichiers acceptés :",
  buttonCancelContent: "Annuler",
  buttonUploadContent: "Envoi",
};

const useStyle = makeStyles(() =>
  createStyles({
    content: {
      color: "#fff",
      backgroundColor: "#bbbbbb",
      borderRadius: "5px",
      padding: "5px 15px 5px 15px",
      width: "100%",
    },
    fullwidth: {
      width: "100%",
    },
    iconFileUploaded: {
      color: "white",
      borderRadius: "50%",
      backgroundColor: "green",
      margin: "1rem",
    },
    divider: {
      margin: ".5rem 0",
    },
    iconErrorUploaded: {
      color: "red",
      margin: "1rem",
    },
    etkDropzoneText: {
      whiteSpace: "pre",
    },
    etkDropzone: {
      backgroundColor: "#f8f8f8",
      color: "#707070",
    },
    submitbtn: {
      alignSelf: "flex-end",
    },
  })
);

const HtmlTooltip = withStyles((theme) => ({
  tooltip: {
    backgroundColor: "#f5f5f9",
    color: "rgba(0, 0, 0, 0.87)",
    maxWidth: 220,
    fontSize: theme.typography.pxToRem(12),
    border: "1px solid #dadde9",
  },
}))(Tooltip);

const ETKUpload: React.FC<ETKUploadProps> = (props) => {
  const classes = useStyle();
  const [file, setFile] = useState<File>();
  const [linearProgressValue, setLinearProgressValue] = useState(0);
  const [error, setError] = useState(null);
  const [inProgress, setInProgress] = useState(false);
  const [xhr, setXHR] = useState(null);

  const ETKFiles = (
    <React.Fragment key={file?.name}>
      {file && !error && (
        <Grid direction="row" container alignItems="center">
          <Grid item xs={2}>
            <GetAppIcon className={classes.iconFileUploaded} />
          </Grid>
          <Grid item xs={10}>
            {file?.name}
          </Grid>
        </Grid>
      )}
      {error && (
        <Grid direction="row" container alignItems="center">
          <Grid item xs={2}>
            <ErrorIcon className={classes.iconErrorUploaded} />
          </Grid>
          <Grid item xs={10}>
            <span>{error}</span>
          </Grid>
        </Grid>
      )}
    </React.Fragment>
  );

  useEffect(() => {
    if (props.step === "uploaded") {
      setFile(null);
    }
  }, [props.step]);

  const htmlTooltip = (
    <React.Fragment>
      {props.tooltipcontent.map((row, index) => (
        <Typography key={`import.upload.title.tooltip.${index}`}>
          {row}
        </Typography>
      ))}
    </React.Fragment>
  );

  const onAddFiles = async (event) => {
    setError(null);

    const fileList = event.dataTransfer
      ? event.dataTransfer.files
      : event.target.files;

    if (fileList.length) {
      setFile(fileList[0]);
    }

    return [];
  };

  const onUploadProgress = (e) => {
    const progress = (e.loaded / e.total) * 100;

    setLinearProgressValue(progress);

    if (props.onUploadProgress) {
      props.onUploadProgress(progress);
    }
  };

  const onUploadLoad = (cXHR) => {
    setInProgress(false);
    setXHR(null);

    const response = JSON.parse(cXHR.response);

    if (cXHR.status !== 200) {
      setError(response.detail);
      return;
    }

    props.onUploaded(response);
  };

  const onUploadError = (cXHR) => {
    const response = JSON.parse(cXHR.response);

    setError(response.detail);
    setInProgress(false);
    setXHR(null);
  };

  const onUploadClick = () => {
    let newXHR = apiRest.geofiles.upload(file, {
      onProgress: onUploadProgress,
      onLoad: onUploadLoad,
      onError: onUploadError,
    });

    setXHR(newXHR);
    setInProgress(true);
  };

  return (
    <Grid container direction="column" justify="center" alignItems="flex-end">
      <Grid container alignItems="center">
        <Typography variant="h6">
          <Grid container alignItems="center">
            <Box component="span" mr={1}>
              {props.boxContent}
            </Box>
            <HtmlTooltip title={htmlTooltip}>
              <HelpIcon />
            </HtmlTooltip>
          </Grid>
        </Typography>
      </Grid>
      <Grid container>
        <ETKProgressBar linearProgressValue={linearProgressValue} />
      </Grid>
      <Grid container>
        <Divider />
      </Grid>
      <Grid container>
        <form noValidate autoComplete="off" className={classes.fullwidth}>
          {props.step !== "uploaded" && !props.missingInfo.length ? (
            <Grid container>
              <DropzoneArea
                acceptedFiles={props.extensionsFileAccepted}
                Icon={GetAppIcon as any}
                dropzoneText={props.dropzoneText}
                dropzoneProps={{
                  getFilesFromEvent: onAddFiles,
                }}
                showPreviewsInDropzone={false}
                showFileNames={true}
                showAlerts={["error"]}
                maxFileSize={50000000} //50MB
                filesLimit={1}
                dropzoneParagraphClass={classes.etkDropzoneText}
                dropzoneClass={classes.etkDropzone}
              />
              <Typography style={{ marginTop: ".7rem" }}>
                {props.fileListHint} {props.extensionsFileAccepted.join(",")}
              </Typography>
            </Grid>
          ) : null}
          {file ? (
            <React.Fragment>
              <Grid container alignItems="center">
                {ETKFiles}
              </Grid>
              <Divider className={classes.divider} />
            </React.Fragment>
          ) : null}
          {file &&
            !(props.missingInfo.length > 0) &&
            props.step !== "readyToUpload" && (
              <Grid container justify="space-between">
                <Button
                  variant="contained"
                  onClick={() => {
                    setFile(null);
                    setError(null);

                    if (xhr?.abort()) {
                      xhr.abort();
                    }

                    setLinearProgressValue(0);
                  }}
                >
                  {props.buttonCancelContent}
                </Button>
                <Button
                  className={classes.submitbtn}
                  disabled={!file || error !== null || inProgress}
                  color="primary"
                  variant="contained"
                  onClick={onUploadClick}
                >
                  {props.buttonUploadContent}
                </Button>
              </Grid>
            )}
        </form>
      </Grid>
    </Grid>
  );
};

ETKUpload.defaultProps = defaultProps;

export default ETKUpload;
