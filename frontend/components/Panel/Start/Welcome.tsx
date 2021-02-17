import React from "react";
import {
  Tabs,
  Tab,
  Grid,
  Typography,
  makeStyles,
  Button,
  SvgIcon,
} from "@material-ui/core";
import PlatHeritage from "@/public/assets/plant-heritage.svg";
import CardAbout from "@/components/Card/About";
import CardInfoPanel from "@/components/Card/InfoPanel";
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
        indicatorColor="primary"
        textColor="primary"
        onChange={handleChange}
        value={value}
      >
        <Tab
          label={
            <Grid container spacing={1}>
              <Grid item>
                <SvgIcon component={PlatHeritage} viewBox="0 0 207.11 212.89" />
              </Grid>
              <Grid item>{t("components.PanelWelcome.tabLabel")}</Grid>
            </Grid>
          }
          onClick={() => setCollapsed(!collapsed)}
        />
      </Tabs>
      <TabPanel value={value} index={0} className={classes.tabPanel}>
        <Grid container direction="column" spacing={2}>
          <Grid item>
            <Typography color="primary" className={classes.title}>
              {t("components.PanelWelcome.title")}
            </Typography>
          </Grid>
          <Grid item>
            <Typography paragraph={true}>
              <Trans>{t("components.PanelWelcome.text")}</Trans>
            </Typography>
          </Grid>
          <Grid item>
            <CardInfoPanel
              icon={
                <SvgIcon component={PlatHeritage} viewBox="0 0 207.11 212.89" />
              }
              title={t("components.PanelWelcome.CardInfoPanel.title")}
              content="14.5 million d'arbres"
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
      color="primary"
      className={classes.collapsedButton}
      onClick={() => setCollapsed(!collapsed)}
    >
      <Grid container direction="column" justify="center" alignItems="center">
        <Grid item>
          <SvgIcon component={PlatHeritage} viewBox="0 0 207.11 212.89" />
        </Grid>
        <Grid item>
          <Typography variant="caption">
            {t("components.PanelWelcome.tabLabel")}
          </Typography>
        </Grid>
      </Grid>
    </Button>
  );
};

ETKPanelWelcome.defaultProps = defaultProps;

export default ETKPanelWelcome;
