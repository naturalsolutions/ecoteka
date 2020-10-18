import React from "react";
import {
  Tabs,
  Tab,
  Grid,
  Typography,
  makeStyles,
  Button,
} from "@material-ui/core";
import { AcUnit } from "@material-ui/icons";
import CardAbout from "../Card/About";
import CardInfoPanel from "../Card/InfoPanel";
import { useTranslation } from "react-i18next";
import { Trans } from "react-i18next";

export interface ETKPanelWelcomeProps {
  collapsed?: boolean;
}

const defaultProps: ETKPanelWelcomeProps = {
  collapsed: true,
};

const useStyles = makeStyles(() => ({
  tabPanel: {
    width: "25rem",
    padding: "1rem",
  },
  title: {
    fontSize: "1.5rem",
    fontWeight: "bold",
  },
  collapsedButton: {
    textTransform: "capitalize",
    maxWidth: "5rem",
    lineHeight: ".6rem",
  },
}));

interface TabPanelProps {
  children?: React.ReactNode;
  index: any;
  value: any;
  className: string;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, className, ...other } = props;
  return (
    <div
      className={className}
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && children}
    </div>
  );
}

const ETKPanelWelcome: React.FC<ETKPanelWelcomeProps> = (props) => {
  const { t } = useTranslation("components");
  const classes = useStyles();
  const [value, setValue] = React.useState(0);
  const [collapsed, setCollapsed] = React.useState(props.collapsed);

  const handleChange = (event: React.ChangeEvent<{}>, newValue: number) => {
    setValue(newValue);
  };

  return !collapsed ? (
    <React.Fragment>
      <Tabs
        indicatorColor="secondary"
        textColor="secondary"
        onChange={handleChange}
        value={value}
      >
        <Tab
          label={
            <Grid container spacing={1}>
              <Grid item>
                <AcUnit />
              </Grid>
              <Grid item>{t("PanelWelcome.tabLabel")}</Grid>
            </Grid>
          }
          onClick={() => setCollapsed(!collapsed)}
        />
      </Tabs>
      <TabPanel value={value} index={0} className={classes.tabPanel}>
        <Grid container direction="column" spacing={2}>
          <Grid item>
            <Typography className={classes.title}>
              {t("PanelWelcome.title")}
            </Typography>
          </Grid>
          <Grid item>
            <Typography paragraph={true}>
              <Trans>{t("PanelWelcome.text")}</Trans>
            </Typography>
          </Grid>
          <Grid item>
            <CardInfoPanel
              icon={<AcUnit />}
              title={t("PanelWelcome.CardInfoPanel.title")}
              content="11 million d'arbres"
            />
          </Grid>
          <Grid item>
            <CardAbout />
          </Grid>
        </Grid>
      </TabPanel>
    </React.Fragment>
  ) : (
    <Button
      color="secondary"
      className={classes.collapsedButton}
      onClick={() => setCollapsed(!collapsed)}
    >
      <Grid container direction="column" justify="center" alignItems="center">
        <Grid item>
          <AcUnit />
        </Grid>
        <Grid item>
          <Typography variant="caption">
            {t("PanelWelcome.tabLabel")}
          </Typography>
        </Grid>
      </Grid>
    </Button>
  );
};

ETKPanelWelcome.defaultProps = defaultProps;

export default ETKPanelWelcome;
