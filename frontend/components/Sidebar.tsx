import React, { createRef, useEffect, useState } from "react";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import { makeStyles, withStyles } from "@material-ui/core/styles";
import Wikipedia from "./Wikipedia";
import { AccordionSummary, Container, IconButton, Menu, MenuItem, Toolbar } from "@material-ui/core";
import MuiAccordion from '@material-ui/core/Accordion';
import MuiAccordionDetails from '@material-ui/core/AccordionDetails';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import MenuIcon from '@material-ui/icons/Menu';
import EditLocationIcon from '@material-ui/icons/EditLocation';
import DeleteIcon from '@material-ui/icons/Delete';
import {apiRest as api} from '../lib/api';
import ETKAlertController from './AlertController';
import { useRouter } from "next/router";

const useStyles = makeStyles((theme) => ({
  logo: {
    maxHeight: "40px",
  },
  buttons: {
    display: "flex",
    width: "100%",
    justifyContent: "flex-end",
  },
  numberOfTrees: {
    width: "100%",
  },
  tabPanel: {
    maxWidth: 500,
    overflowY: "auto",
  },
  propertyValue: {
    overflowWrap: "break-word",
  },
  toolbartitle: {
    flexGrow: 1
  }
}));

const Accordion = withStyles({
  root: {
    border: 0,
    boxShadow: 'none'
  },
  expanded: {}
})(MuiAccordion);

const AccordionDetails = withStyles({
  root: {
    flexDirection: 'column',
    overflowY: 'scroll',
    height: '600px'
  }
})(MuiAccordionDetails)

const isFromPrivateLayer = (properties) => properties ? Boolean(properties.id) : false;

function Properties(props) {
  const classes = useStyles();

  const renderPrivateTreeProperies = (properties) => (
    <Grid container>
      <Grid item xs={12}>
        <Typography variant="subtitle1">{properties.scientific_name}</Typography>
      </Grid>
      <Grid item xs={6}>
        <Typography variant="caption">Latitude</Typography> {properties.y}
      </Grid>
      <Grid item xs={6}>
        <Typography variant="caption">Longitude</Typography> {properties.x}
      </Grid>
    </Grid>
  );

  const renderPublicTreeProperties = (properties) =>
  props.properties ? (
    <Grid container spacing={3}>
      {Object.keys(props.properties).map((property) => {
        return (
          <React.Fragment key={property}>
            <Grid item xs>
              <Typography>{property}</Typography> {props.properties[property]}
            </Grid>
          </React.Fragment>
        );
      })}
    </Grid>
    ) : (
    <div>Aucune propriété</div>
    );

  if (isFromPrivateLayer(props.properties)) {
    return renderPrivateTreeProperies(props.properties);
  } else {
    return renderPublicTreeProperties(props.properties);
  }
}

export interface ETKSidebarProps {
  activeTab: number;
  currentGenre: string;
  currentProperties: any;
  onTabChange: Function;
  speces: any[];
}

const ETKSidebar: React.FC<ETKSidebarProps> = (props) => {
  const classes = useStyles();
  const router = useRouter();

  const alertRef = createRef<ETKAlertController>();

  const nullData = {properties: null, genre: null};
  const [data, setData] = useState(nullData);
  const [anchorEl, setAnchorEl] = React.useState(null);

  const openMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const closeMenu = () => {
    setAnchorEl(null);
  };
  const editTree = (id) => {
    router.push(`/treeedition?id=${id}`)
  }
  const deleteTree = (id) => {
    alertRef.current.create({
      title: 'Confirmation',
      message: 'Voulez-vous supprimer cet arbre ?',
      actions: [
        {label: 'Oui', value: true},
        {label: 'Non', value: false}
      ],
      onDismiss: (v) => {
        if (!v) { return; }

        api.trees.delete(id).then(
          () => alertRef.current.create({
            title: 'Succès',
            message: "L'arbre a été supprimé.",
            actions: [{label: 'Ok', value: true}],
            onDismiss: () => {
              setData(nullData);
              closeMenu();
            }
          })
        );
      }
    });
  }

  useEffect(() => {
    closeMenu();

    if (isFromPrivateLayer(props.currentProperties)) {
      api.trees.get(props.currentProperties.id)
      .then(response => setData({
        properties: response,
        genre: response.scientific_name
      }));
    } else {
      setData({
        properties: props.currentProperties,
        genre: props.currentGenre
      });
    }
  },[props]);

  const menu = isFromPrivateLayer(data.properties) ? 
    (
      <Menu
        id="simple-menu"
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={closeMenu}
      >
        <MenuItem onClick={(e) => editTree(data.properties.id)}>
          <EditLocationIcon />
          Modifier
        </MenuItem>
        <MenuItem onClick={(e) => deleteTree(data.properties.id)}>
          <DeleteIcon />
          Supprimer
        </MenuItem>
      </Menu>
    ) : null;
  
  return (
    <React.Fragment>
      <Toolbar>
        <Typography className={classes.toolbartitle} variant="h6">Fiche de l'arbre</Typography>
        <IconButton edge="end" color="inherit" aria-label="menu" onClick={openMenu}>
          <MenuIcon />
        </IconButton>
      </Toolbar>
      <Container>
        <Properties properties={data.properties} />
      </Container>

      <Accordion square>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
        >
          <Typography variant="h6">
            Informations Wikipedia
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Wikipedia genre={data.genre} />
        </AccordionDetails>
      </Accordion>

      {menu}
      <ETKAlertController ref={alertRef} />
    </React.Fragment>
  );
};

export default ETKSidebar;
