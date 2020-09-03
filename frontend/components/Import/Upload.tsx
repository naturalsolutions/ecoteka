import React, { useState } from "react";
import { makeStyles, createStyles, withStyles } from "@material-ui/core/styles";
import { Tooltip, Box, Grid } from "@material-ui/core";
import HelpIcon from "@material-ui/icons/Help";
import Divider from "@material-ui/core/Divider";
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography'
import { DropzoneArea } from 'material-ui-dropzone'
import GetAppIcon from '@material-ui/icons/GetApp';
import ErrorIcon from '@material-ui/icons/Error';
import ETKProgressBar from './ProgressBar'


export interface ETKUploadProps {
  tooltipcontent: [string];
  extensionsFileAccepted: [string];
  dropzoneText: string;
  step: string;
  linearProgressValue: number;
  progressBarMessage: string;
  onClickButton(status:boolean):void;
  files: [File?]
  onStepChanged(newState:string):void;
  onFilesAdd(newFiles:[File?]):void;
}

const useStyle = makeStyles(() =>
  createStyles({
    content: {
      color: "#fff",
      backgroundColor: "#bbbbbb",
      borderRadius: "5px",
      padding: "5px 15px 5px 15px",
      width: "100%",
    },
    import: {
      // alignSelf: "flex-start",
    },
    fullwidth: {
      width: "100%",
    },
    iconFileUploaded: {
      color: "white",
      borderRadius: "50%",
      backgroundColor: "green",
      margin: '1rem'
    },
    divider: {
      margin: ".5rem"
    },
    iconErrorUploaded: {
      color: "red",
      margin: '1rem'
    },
    etkDropzoneText: {
      whiteSpace: "pre"
    },
    etkDropzone: {
      backgroundColor: "#f8f8f8",
      color: "#707070"
    },
    submitbtn: {
      alignSelf: "flex-end"
    }
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
  // const [files, setFiles] = useState([])

  const isCancellable = ['','UPLOAD_COMPLETE'].includes(props.step);
  const inProgress = ['PROCESSING_DATA', 'UPLOAD_START'].includes(props.step);


  const ETKFiles = props.files?.map(file => {

    const isOk = file.__isUploaded && !file.__isOnServ;
    const isError = file.__isUploaded && file.__isOnServ;
    console.log("upload", file.__isUploaded , "o nserver", file.__isOnServ)

    return (
      <React.Fragment key={file.name}>
        {isOk &&
          <GetAppIcon className={classes.iconFileUploaded} />
        }
        {isError &&
          <ErrorIcon className={classes.iconErrorUploaded} />
        }
        {file.name}
        {isError &&
          <p>
            This file was uploaded
          </p>
        }
      </React.Fragment>
    )
  });

  const myCustomFilesGetter = async (event) => {
    const files = [] as [File?];
    const fileList = event.dataTransfer ? event.dataTransfer.files : event.target.files;

    for (const file of fileList) {
      Object.defineProperty(file, '__isUploaded', {
        value: true,
        writable: true
      });

      Object.defineProperty(file, '__isOnServ', {
        value: undefined,
        writable: true
      });

      files.push(file);
    }
    props.onFilesAdd(files)
    return files
  }

  const hasFiles = props.files?.length > 0
  const showDropZoneStyle = {
    display: `${!!hasFiles ? 'none' : 'flex'}`
  }

  const showFilesStyle = {
    display: `${hasFiles ? 'flex' : 'none'}`
  }

  const showButtons = props.step !== 'UPLOAD_COMPLETE'

  const htmlTooltip = (
    <React.Fragment>
      {props.tooltipcontent.map((row, index) => (
        <Typography key={`import.step1.title.tooltip.${index}`}>
          {row}
        </Typography>
      ))}
    </React.Fragment>
  )

  return (
    <Grid
      container
      direction="column"
      justify="center"
      alignItems="flex-end"
      className={classes.import}
    >
      <Grid container alignItems="center">
        <Typography variant="h4">
          <Grid container alignItems="center">
            <Box component="span" mr={1}>
              Import your datas
            </Box>
            <HtmlTooltip title={htmlTooltip}>
              <HelpIcon />
            </HtmlTooltip>
          </Grid>
        </Typography>
      </Grid>
      <Grid container>
        <ETKProgressBar
          step={props.step}
          linearProgressValue={props.linearProgressValue}
          message={props.progressBarMessage}
        />
      </Grid>
      <Grid container>
        <Divider />
      </Grid>
      <Grid container>
        <form noValidate autoComplete="off" className={classes.fullwidth}>
          <Grid container style={showDropZoneStyle} >
              <DropzoneArea
                acceptedFiles={props.extensionsFileAccepted}
                Icon={GetAppIcon}
                dropzoneText={props.dropzoneText}
                dropzoneProps={{
                  getFilesFromEvent: myCustomFilesGetter
                }}
                showPreviewsInDropzone={false}
                showFileNames={true}
                showAlerts={['error']}
                maxFileSize={50000000} //50MB
                filesLimit={1}
                dropzoneParagraphClass={ `${classes.etkDropzoneText}` }
                dropzoneClass={ `${classes.etkDropzone}` }
              />
              <Typography>Files types accepted : {props.extensionsFileAccepted.join(',')}</Typography>
          </Grid>
          <React.Fragment>
            <Grid
              container
              alignItems="center"
              style={showFilesStyle} >
              {ETKFiles}
            </Grid>
            <Divider className={classes.divider}/>
          </React.Fragment>
          { showButtons &&
          <Grid
              container
              justify="space-between"
            >
            <Button
              disabled={props.files?.length ? false : true}
              variant="contained"
              onClick={() => {
                if (isCancellable) {
                  props.onStepChanged('RESET')
                  return
                }
                props.onClickButton(false);
              }}
            >
              Cancel
            </Button>
            <Button
              className={classes.submitbtn}
              disabled={!props.files?.length || props.files[0].__isOnServ ? true : false}
              color="primary"
              variant="contained"
              onClick={() => {
                props.onClickButton(true);
              }}
            >
              Submit
            </Button>
          </Grid>
          }
        </form>
      </Grid>
    </Grid>
  );
};

ETKUpload.defaultProps = {};

export default ETKUpload;
