import React, { useState, useEffect } from "react";
import { makeStyles, createStyles, withStyles } from "@material-ui/core/styles";
import {
  Tooltip,
  Box,
  Grid,
  Divider,
  Button,
  Typography,
} from "@material-ui/core";
import HelpIcon from "@material-ui/icons/Help";
import { DropzoneArea } from "material-ui-dropzone";
import GetAppIcon from "@material-ui/icons/GetApp";
import ErrorIcon from "@material-ui/icons/Error";
import ETKProgressBar from "@/components/Import/Panel/ProgressBar";
import { useTranslation, Trans } from "react-i18next";
import { useAppContext } from "@/providers/AppContext";

import Geofile from "@/components/Geofile";
import { apiRest } from "@/lib/api";

export interface ETKUploadProps {
  geofile?: Geofile;
  missingInfo?: [string?];
  step?: string;
  onUploadProgress?(progress: number): void;
  onUploaded?(geofile: Geofile): void;
}

const defaultProps: ETKUploadProps = {
  geofile: undefined,
  missingInfo: [""],
  step: "start",
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
    etkDropzone: {},
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

const ALLOWED_EXTENSIONS = [".xls", ".xlsx", ".csv", ".geojson", ".zip"];

const ETKUpload: React.FC<ETKUploadProps> = (props) => {
  const classes = useStyle();
  const { t } = useTranslation("components");
  const [file, setFile] = useState<File>();
  const [linearProgressValue, setLinearProgressValue] = useState(0);
  const [error, setError] = useState(null);
  const [inProgress, setInProgress] = useState(false);
  const [xhr, setXHR] = useState(null);
  const { user } = useAppContext();

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
  }, [t("Import.Upload.step")]);

  const htmlTooltip = (
    <Typography>
      <Trans>{t("Import.Index.tooltipContent")}</Trans>
    </Typography>
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
    let newXHR = apiRest.geofiles.upload(user.currentOrganization.id, file, {
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
              {t("Import.Upload.boxContent")}
            </Box>
            <HtmlTooltip title={htmlTooltip}>
              <HelpIcon color="primary" />
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
                acceptedFiles={ALLOWED_EXTENSIONS}
                Icon={GetAppIcon as any}
                dropzoneText={t("Import.Upload.dropzoneText")}
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
                {t("Import.Upload.fileListHint")} {ALLOWED_EXTENSIONS.join(",")}
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
                  onClick={() => {
                    setFile(null);
                    setError(null);

                    if (xhr?.abort()) {
                      xhr.abort();
                    }

                    setLinearProgressValue(0);
                  }}
                >
                  {t("Import.Upload.buttonCancelContent")}
                </Button>
                <Button
                  className={classes.submitbtn}
                  disabled={!file || error !== null || inProgress}
                  color="primary"
                  variant="contained"
                  onClick={onUploadClick}
                >
                  {t("Import.Upload.buttonUploadContent")}
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
