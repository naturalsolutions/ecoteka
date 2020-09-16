import React from "react";
import { Button, Typography, Grid, Box } from "@material-ui/core";
import { makeStyles, createStyles } from "@material-ui/core/styles";

export interface ETKImportTemplateProps {
  isOpen?: Boolean;
  titleText?: string;
  hintText?: string;
  templateTips?: string;
  longitudeText?: string;
  latitudeText?: string;
  crsText?: string;
  downloadText?: string;
  linkTemplate?: string;
}

const defaultProps: ETKImportTemplateProps = {
  isOpen: true,
  titleText: "Un doute avec votre fichier?",
  hintText:
    "Assurez-vous que votre fichier contient les informations suivantes",
  templateTips: "N'hésitez pas à télécharger notre modèle au format csv",
  latitudeText: "Latitude",
  longitudeText: "Longitude",
  crsText: "Système de Réfèrence de Coordonnées",
  downloadText: "TÉLÉCHARGER LE TEMPLATE",
  linkTemplate: "/assets/ecoteka_import_template.xslx",
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
  })
);

const ETKImportTemplate: React.FC<ETKImportTemplateProps> = (props) => {
  const classes = useStyle();

  return props.isOpen ? (
    <React.Fragment>
      <Grid container direction="column" justify="center" alignItems="flex-end">
        <Grid className={classes.content}>
          <Typography variant="h6">{props.titleText}</Typography>
          {props.hintText}
          <Grid>
            <div>- {props.latitudeText}</div>
            <div>- {props.longitudeText}</div>
            <div>- {props.crsText}</div>
          </Grid>
        </Grid>
        <Box mt={3} mb={1}>
          <Typography>{props.templateTips}</Typography>
        </Box>
        <Button
          variant="outlined"
          size="large"
          href={props.linkTemplate}
          target="_blank"
        >
          {props.downloadText}
        </Button>
      </Grid>
    </React.Fragment>
  ) : null;
};

ETKImportTemplate.defaultProps = defaultProps;

export default ETKImportTemplate;
