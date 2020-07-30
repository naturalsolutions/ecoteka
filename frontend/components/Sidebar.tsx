import React from 'react';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Wikipedia from './Wikipedia';
import Filter from './Filter';

const useStyles = makeStyles(() => ({
  logo: {
    maxHeight: '40px',
  },
  buttons: {
    display: 'flex',
    width: '100%',
    justifyContent: 'flex-end',
  },
  numberOfTrees: {
    width: '100%',
  },
  tabPanel: {
    maxWidth: 500,
    overflowY: 'auto',
  },
  propertyValue: {
    overflowWrap: 'break-word',
  },
}));

interface TabPanelProps {
  children?: React.ReactNode;
  index: any;
  value: any;
}

function TabPanel(props: TabPanelProps) {
  const classes = useStyles();
  const { children, value, index, ...other } = props;

  return (
    <div
      className={classes.tabPanel}
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box p={3}>{children}</Box>}
    </div>
  );
}

function Properties(props) {
  const classes = useStyles();

  return props.properties ? (
    <Grid container spacing={3}>
      {Object.keys(props.properties).map((property) => {
        return (
          <React.Fragment key={property}>
            <Grid item xs={6}>
              {property}
            </Grid>
            <Grid item xs={6}>
              <Typography className={classes.propertyValue}>
                {props.properties[property]}
              </Typography>
            </Grid>
          </React.Fragment>
        );
      })}
    </Grid>
  ) : (
    <div>No properties</div>
  );
}

function a11yProps(index: any) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

export interface ETKSidebarProps {
  activeTab: number;
  currentGenre: string;
  currentProperties: any;
  onFilterSpecies: string;
  onTabChange(): void;
  speces: any[];
}

const ETKSidebar: React.FC<ETKSidebarProps> = (props) => {
  const [activeTab, setActiveTab] = React.useState(props.activeTab);

  const handleChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  return (
    <React.Fragment>
      <Tabs
        value={activeTab}
        onChange={handleChange}
        aria-label="simple tabs example"
      >
        <Tab label="Wikipedia" {...a11yProps(0)} />
        <Tab label="Properties" {...a11yProps(1)} />
        <Tab label="Filter" {...a11yProps(2)} />
      </Tabs>
      <TabPanel value={activeTab} index={0}>
        <Wikipedia genre={props.currentGenre} />
      </TabPanel>
      <TabPanel value={activeTab} index={1}>
        <Properties properties={props.currentProperties} />
      </TabPanel>
      <TabPanel value={activeTab} index={2}>
        <Filter speces={props.speces} onFilterSpecies={props.onFilterSpecies} />
      </TabPanel>
    </React.Fragment>
  );
};

export default ETKSidebar;
