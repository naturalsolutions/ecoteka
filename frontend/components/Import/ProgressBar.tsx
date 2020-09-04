import React from "react";
import { makeStyles, createStyles } from "@material-ui/core/styles";
import LinearProgress from "@material-ui/core/LinearProgress";

export interface ETKProgressBarProps {
  linearProgressValue: number;
  message: string;
}

const useStyle = makeStyles(() =>
  createStyles({
    root: {
      width: "100%",
      marginTop: ".5rem",
      marginBottom: ".5rem",
    },
  })
);

const ETKProgressBar: React.FC<ETKProgressBarProps> = (props) => {
  const classes = useStyle();
  let properties = {};

  // switch (props.step) {
  //   case "UPLOAD_START": {
  //     properties = {
  //       variant: "determinate",
  //       value: props.linearProgressValue,
  //     };

  //     break;
  //   }
  //   case "PROCESSING_DATA": {
  //     properties = {
  //       color: "primary",
  //     };

  //     break;
  //   }
  //   case "IMPORT_PENDING": {
  //     properties = {
  //       color: "primary",
  //     };
  //     break;
  //   }

  //   default: {
  //     properties = {
  //       variant: "determinate",
  //       value: props.linearProgressValue,
  //     };
  //     break;
  //   }
  // }

  return (
    <React.Fragment>
      <LinearProgress
        variant="determinate"
        value={props.linearProgressValue}
        {...properties}
        className={classes.root}
      />
      <em>{props.message}</em>
      {/* {
        step === 'UPLOAD_START'
        &&
        <React.Fragment>
          <LinearProgress variant="determinate" value={linearProgressValue} />
          <em>
            Envoie du fichier en cours...
          </em>
        </React.Fragment>
      }
      {
        step === 'PROCESSING_DATA'
        &&
        <React.Fragment>
          <LinearProgress color="primary" />
          <em>
            Vérification de la validité du fichier à importer...
          </em>
        </React.Fragment>
      }
      {
        step === 'IMPORT_PENDING'
        &&
        <React.Fragment>
          <LinearProgress color="primary" />
          <em>
            En cours d'importation...
          </em>
        </React.Fragment>
      } */}
    </React.Fragment>
  );
};

ETKProgressBar.defaultProps = {};

export default ETKProgressBar;
