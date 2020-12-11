import React, { useRef } from "react";
import {
  Box,
  Container,
  Grid,
  makeStyles,
  Paper,
  Typography,
} from "@material-ui/core";
import { useTranslation } from "react-i18next";
import { useRouter } from "next/router";
import { useAppContext } from "@/providers/AppContext";
import Widget from "@/components/Dashboard/Widget";
import { useTrail, useTransition, useChain } from "react-spring";
import { Trail as SpringTail } from "react-spring/renderprops.cjs";

export interface ETKDashboardProps {}

const defaultProps: ETKDashboardProps = {};

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  paper: {
    padding: theme.spacing(2),
    textAlign: "center",
    color: theme.palette.text.secondary,
  },
}));

const ETKDashboard: React.FC<ETKDashboardProps> = (props) => {
  const classes = useStyles();
  const { t } = useTranslation("components");
  const { user } = useAppContext();
  const router = useRouter();
  const widgets = [
    {
      name: "a.widget.1",
    },
    {
      name: "a.widge.2",
    },
    {
      name: "a.widget.3",
    },
  ];

  return (
    <Container>
      <Box py={4}>
        <Typography variant="h6" component="h1">
          {t("Dashboard.title")} 2020 {t("Dashboard.for")}{" "}
          {user.currentOrganization?.name}
        </Typography>
      </Box>
      <Grid container spacing={3}>
        <SpringTail
          items={widgets}
          keys={(widget) => widget.name}
          from={{ opacity: 0, transform: "translate3d(-40px,-10px,0)" }}
          to={{
            opacity: 1,
            transform: "translate3d(0px,0px,0)",
            delay: 2000,
            duration: 600,
          }}
        >
          {(widget) => (props) => (
            <Widget
              gridProps={{ item: true, xs: 4 }}
              paperProps={{ elevation: 2 }}
              springProps={props}
            >
              {widget.name}
            </Widget>
          )}
        </SpringTail>
      </Grid>
    </Container>
  );
};

ETKDashboard.defaultProps = defaultProps;

export default ETKDashboard;
