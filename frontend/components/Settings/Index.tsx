import React, { useState, useEffect } from "react";
import {
  makeStyles,
  Box,
  Grid,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListSubheader
} from "@material-ui/core";
import { useRouter } from "next/router";
import dynamic from "next/dynamic";
import AccountCircle from '@material-ui/icons/AccountCircle';
import TuneIcon from '@material-ui/icons/Tune';
import LockIcon from '@material-ui/icons/Lock';

const useStyles = makeStyles(() => ({
  root: {
    maxWidth: "100%",
    height: "100%",
    margin: "0 auto"
  }
}));



export default function SettingsTemplate(props) {
  const classes = useStyles();
  const router = useRouter();

  function ListItemLink(props) {
    return <ListItem button component="a" {...props} />;
  }

  const listItems = [
    {
      path:'/settings/profile/',
      icon: <AccountCircle />,
      label: 'Profile'
    },
    {
      path:'/settings/preferences/',
      icon: <TuneIcon />,
      label: 'Preferences'
    },
    {
      path:'/settings/new-password/',
      icon: <LockIcon />,
      label: 'Password'
    }
  ]

  const Panels = {
    '/settings/profile/': dynamic( ()=> import("./Profile/Form") )
  }
  console.log(router.pathname)


  const Panel = Panels[router.pathname]
  return (
    <Box p={2}>
      <Grid container spacing={0}>
        <Grid item xs={2}>
          <List
            component="nav"
            aria-labelledby="nested-list-subheader"
            subheader={
              <ListSubheader component="div" id="nested-list-subheader">
                User settings
              </ListSubheader>
            }
          >
            {listItems.map( (item, index)=> {
              return (
                <ListItemLink key={index} selected={router.pathname == item.path} href={item.path}>
                  <ListItemIcon>
                    {item.icon}
                  </ListItemIcon>
                  <ListItemText primary={item.label}/>
                </ListItemLink>
              )
            })}
          </List>
        </Grid>
        <Grid item xs={10}>
          blabla
          {/* <Panel /> */}
        </Grid>
      </Grid>
    </Box>
  );
}
