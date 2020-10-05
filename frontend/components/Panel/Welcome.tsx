import React from "react";
import { Tabs, Tab, Grid, Typography, makeStyles } from "@material-ui/core";
import { AcUnit } from "@material-ui/icons";
import CardAbout from "../Card/About";
import CardInfoPanel from "../Card/InfoPanel";
import { useTranslation } from "react-i18next";
import { Trans } from "react-i18next";

export interface ETKPanelWelcomeProps {}

const defaultProps: ETKPanelWelcomeProps = {};

const useStyles = makeStyles(() => ({
  tabPanel: {
    width: "25rem",
    padding: "1rem",
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

function a11yProps(index: any) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

const ETKPanelWelcome: React.FC<ETKPanelWelcomeProps> = (props) => {
  const { t } = useTranslation("components");
  const classes = useStyles();
  const [value, setValue] = React.useState(0);

  const handleChange = (event: React.ChangeEvent<{}>, newValue: number) => {
    setValue(newValue);
  };

  return (
    <React.Fragment>
      <Tabs
        indicatorColor="secondary"
        textColor="secondary"
        aria-label="disabled tabs example"
        onChange={handleChange}
        value={value}
      >
        <Tab label={t("PanelWelcome.tabLabel")} />
      </Tabs>
      <TabPanel value={value} index={0} className={classes.tabPanel}>
        <Grid container direction="column" spacing={2}>
          <Grid item>
            <Typography variant="h4">{t("PanelWelcome.title")}</Typography>
          </Grid>
          <Grid item>
            <Typography>
              <Trans>{t("PanelWelcome.text")}</Trans>
            </Typography>
          </Grid>
          <Grid item>
            <CardInfoPanel
              iconContent={AcUnit}
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
  );
};

ETKPanelWelcome.defaultProps = defaultProps;

export default ETKPanelWelcome;
