import React, { createRef, useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Container,
  Grid,
  IconButton,
  Menu,
  MenuItem,
  Paper,
  Toolbar,
  Typography,
} from "@material-ui/core";
import { MoreVert, EditLocation, Delete, ExpandMore } from "@material-ui/icons";
import Wikipedia from "./Wikipedia";
import ETKAlertController from "./AlertController";
import { apiRest as api } from "../lib/api";
import { useRouter } from "next/router";

const useStyles = makeStyles(() => ({
  root: {
    width: "400px",
  },
  toolbarTitle: {
    flexGrow: 1,
  },
}));

const isFromPrivateLayer = (properties) =>
  properties ? Boolean(properties.id) : false;

function Properties(props) {
  const renderPrivateTreeProperies = (properties) => (
    <Grid container>
      <Grid item xs={12}>
        <Typography variant="subtitle1">
          {properties.scientific_name}
        </Typography>
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
    properties ? (
      <Grid container spacing={3}>
        {Object.keys(properties).map((property) => {
          return (
            <React.Fragment key={property}>
              <Grid item xs>
                <Typography>{property}</Typography> {properties[property]}
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
  currentGenre: string;
  currentProperties: any;
}

const ETKSidebar: React.FC<ETKSidebarProps> = (props) => {
  const classes = useStyles();
  const router = useRouter();

  const alertRef = createRef<ETKAlertController>();

  const nullData = { properties: null, genre: null };
  const [data, setData] = useState(nullData);
  const [anchorEl, setAnchorEl] = React.useState(null);

  const openMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const closeMenu = () => {
    setAnchorEl(null);
  };
  const editTree = (id) => {
    router.push(`/treeedition?id=${id}`);
  };
  const deleteTree = (id) => {
    alertRef.current.create({
      title: "Confirmation",
      message: "Voulez-vous supprimer cet arbre ?",
      actions: [
        { label: "Oui", value: true },
        { label: "Non", value: false },
      ],
      onDismiss: (v) => {
        if (!v) {
          return;
        }

        api.trees.delete(id).then(() =>
          alertRef.current.create({
            title: "Succès",
            message: "L'arbre a été supprimé.",
            actions: [{ label: "Ok", value: true }],
            onDismiss: () => {
              setData(nullData);
              closeMenu();
            },
          })
        );
      },
    });
  };

  useEffect(() => {
    closeMenu();

    if (isFromPrivateLayer(props.currentProperties)) {
      api.trees.get(props.currentProperties.id).then((response) =>
        setData({
          properties: response,
          genre: response.scientific_name,
        })
      );
    } else {
      setData({
        properties: props.currentProperties,
        genre: props.currentGenre,
      });
    }
  }, [props]);

  const menu = isFromPrivateLayer(data.properties) ? (
    <Menu
      id="simple-menu"
      anchorOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      transformOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      anchorEl={anchorEl}
      keepMounted
      open={Boolean(anchorEl)}
      onClose={closeMenu}
    >
      <MenuItem onClick={(e) => editTree(data.properties.id)}>
        <EditLocation />
        Modifier
      </MenuItem>
      <MenuItem onClick={(e) => deleteTree(data.properties.id)}>
        <Delete />
        Supprimer
      </MenuItem>
    </Menu>
  ) : null;

  return (
    <Paper elevation={0} className={classes.root}>
      <Toolbar>
        <Typography className={classes.toolbarTitle} variant="h6">
          Fiche de l'arbre
        </Typography>
        <IconButton
          edge="end"
          color="inherit"
          aria-label="menu"
          onClick={openMenu}
        >
          <MoreVert />
        </IconButton>
      </Toolbar>

      <Container>
        <Properties properties={data.properties} />
      </Container>

      <Accordion square elevation={0}>
        <AccordionSummary expandIcon={<ExpandMore />}>
          <Typography variant="h6">Informations Wikipedia</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Wikipedia genre={data.genre} />
        </AccordionDetails>
      </Accordion>

      {menu}
      <ETKAlertController ref={alertRef} />
    </Paper>
  );
};

export default ETKSidebar;
