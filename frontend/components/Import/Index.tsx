import React, { useState, useEffect } from "react";
import { makeStyles, createStyles } from "@material-ui/core/styles";
import Grid from '@material-ui/core/Grid';
import getConfig from "next/config";
import ETKGeofile from "../Geofile"
import ETKImportTemplate from "./Template"
import ETKMissingDatas from "./MissingDatas"
import ETKButtonImport from "./ButtonImport"
import ETKUpload from "./Upload"


const { publicRuntimeConfig } = getConfig();

export interface ETKImportProps {
  width?: Number;
  isOpen: File;
  tooltipcontent: [string];
  extensionsFileAccepted: [string];
  templateTips: string
  dropzoneText: string
}

export interface Choice {
  value?: string;
  label?: string;
};

const useStyles = makeStyles((theme) =>
  createStyles({
    root: {
    },
    import: {
      alignSelf: "flex-start"
    }
  })
);

const ETKImport: React.FC<ETKImportProps> = (props) => {
  const classes = useStyles();
  const [makeXHRCall, setmakeXHRCall] = useState(false);
  const [linearProgressValue, setLinearProgressValue] = useState(0)
  const [step, setStepValue] = useState('')
  const [templateIsOpen, setTemplateIsOpen] = useState(true)

  useEffect(() => {
    switch (step) {
      case 'UPLOAD_START': {
        setProgressBarMessage('Envoie du fichier en cours...')
        break;
      }
      case 'PROCESSING_DATA': {
        setProgressBarMessage('Vérification de la validité du fichier à importer...')
        break;
      }
      case 'IMPORT_PENDING': {
        setProgressBarMessage('En cours d\'importation...')
        break;
      }
      case 'UPLOAD_COMPLETE': {
        setTemplateIsOpen(false)
        setLinearProgressValue(0)
        setProgressBarMessage('')
        break;
      }
      case 'RESET': {
        setLinearProgressValue(0)
        setProgressBarMessage('')
        setMissingInfos([])
        setLatitudeLongitudeChoices([])
        setFiles([])
        setGeoFile(null)
        setStepValue('')
        setTemplateIsOpen(true)
        setIsImportActivated(false)
        break;
      }
      default: {
        console.log("default")
        break;
      }
    }

    console.log("step : ", step)
  }, [step]);

  const [geofile, setGeoFile] = useState<ETKGeofile>();
  const [progressBarMessage, setProgressBarMessage] = useState('');
  const [missingInfos, setMissingInfos] = useState([] as [string?]);
  const [latitudeLongitudeChoices, setLatitudeLongitudeChoices] = useState([] as unknown as [Choice?]);
  const [crsColumnChoices, setCrsColumnChoices] = useState([
    { value: '1', label: '1' },
    { value: '2', label: '2' },
    { value: '3', label: '3' },
  ] as unknown as [Choice?]);

  const [isImportActivated, setIsImportActivated] = useState(false)
  const [files, setFiles] = useState([] as [File?])


  const showImportButton = {
    display: `${ geofile ? 'block' : 'none'}`
  }



  useEffect(() => {
    const xhr = new XMLHttpRequest();
    if (makeXHRCall) {
      const formData = new FormData();
      const fileToSend = files[0];
      formData.append(
        "file",
        fileToSend,
        fileToSend.name
      );
      const url = `${publicRuntimeConfig.apiUrl}/geo_files/upload`;

      xhr.upload.onprogress = (event) => {
        let value = (event.loaded / event.total) * 100;
        setLinearProgressValue(value);
      };

      xhr.upload.onload = () => {
        setStepValue('PROCESSING_DATA')
      };

      xhr.onerror = (error) => {
        fileToSend.__isOnServ = true;
        setmakeXHRCall(false)
        setStepValue('')
      }
      xhr.onload = (event) => {
        console.log(event)
        setStepValue('UPLOAD_COMPLETE')
        if (200 <= xhr.status && xhr.status < 300) {
          console.log("load general")
          let keysToCheck = ['crs', 'latitude_column', 'longitude_column']
          let keysMissing = []
          let driversToCheck = ['CSV', 'Excel']

          fileToSend.__isOnServ = false;

          setmakeXHRCall(false)

          let resp = JSON.parse(xhr.response)
          setGeoFile(resp)

          if (resp.driver && driversToCheck.includes(resp.driver)) {
            for (let i = 0; i < keysToCheck.length; i++) {
              if (!resp[keysToCheck[i]]) {
                keysMissing.push(keysToCheck[i])
              }
            }
          }

          if (keysMissing) {
            setMissingInfos(keysMissing)
            let choicesLatLon = []
            for (let item in resp.properties) {
              console.log(item)
              choicesLatLon.push({
                value: item,
                label: item
              })
            }
            console.log(choicesLatLon)
            if (choicesLatLon) {
              setLatitudeLongitudeChoices(choicesLatLon)
            }
          }

          //ici pour xls
          return
        }
        xhr.onerror(event)

      };

      xhr.onabort = () => {
        setmakeXHRCall(false)
        setStepValue('')
      };

      xhr.open('POST', url, true);
      xhr.setRequestHeader('Authorization', "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE1OTkxMDkzOTEsInN1YiI6IjEifQ.7bEsHrvZdZjhPAxtm2Lxw7wY6HUv0mxJ-bFH4VqqX4");
      setStepValue('UPLOAD_START')
      xhr.send(formData);
    }


    return () => {
      xhr.abort()
    }

  }, [makeXHRCall]);

  return (
      <Grid
        container
        direction="column"
        justify="center"
        className={classes.root}
        style={{width: `${props.width}px`, height: '100%'}}
      >
        <Grid item>
          <ETKUpload
            tooltipcontent={props.tooltipcontent}
            extensionsFileAccepted={props.extensionsFileAccepted}
            dropzoneText={props.dropzoneText}
            step={step}
            linearProgressValue={linearProgressValue}
            progressBarMessage={progressBarMessage}
            onClickButton={( status ) => setmakeXHRCall(status)}
            files={files}
            onStepChanged={(newState) => setStepValue(newState)}
            onFilesAdd={(files) => setFiles(files)}
          />
        </Grid>
        <Grid item style={{width: '100%', padding: '0 1rem'}}>
          <ETKMissingDatas
            geoFile={geofile}
            missingInfos={missingInfos}
            step={step}
            latitudeLongitudeChoices={latitudeLongitudeChoices}
            crsColumnChoices={crsColumnChoices}
            onUpdateGeofile={(newGeoFile) => {
              //TODO handling object return from child
              // if geofile  ok everything is good we can setgeofile and activate import
              // if geofile is an error or something else we do nothing ?
              if (newGeoFile) {
                setMissingInfos([])
                setGeoFile(newGeoFile)
                setIsImportActivated(true)
                console.log("new geofile",geofile)
              }
            }}
            titleText='The file you upload missing some informations'
            hintText='Please define the fields corresponding to the columns of your file'
          />
        </Grid>
        <Grid item style={showImportButton}>
          <ETKButtonImport
            name={geofile?.name} //TODO something wrong we go no name in button
            onUpdateStepValue={(newStep) => setStepValue(newStep)}
            hidden={!isImportActivated}
          />
        </Grid>
        <Grid item style={{ flexGrow: 1 }}>
          <span>&nbsp;</span>
        </Grid>
        <Grid item>
          <ETKImportTemplate
          isOpen={templateIsOpen}
          />
        </Grid>
      </Grid>
  );
};

ETKImport.defaultProps = {
  width: 500
}

export default ETKImport;