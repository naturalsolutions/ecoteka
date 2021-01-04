import React, { useEffect, useState, SetStateAction } from "react";
import {
  Box,
  Button,
  Container,
  Grid,
  GridSpacing,
  makeStyles,
  Step,
  StepLabel,
  Stepper,
  Typography,
} from "@material-ui/core";
import { Nature as TreeIcon, Euro as EuroIcon } from "@material-ui/icons";
import { GiFruitTree, GiLogging, GiPlantRoots } from "react-icons/gi";
import { IconContext } from "react-icons";
import { useTranslation } from "react-i18next";
import { useRouter } from "next/router";
import { useAppContext } from "@/providers/AppContext";
import Widget from "@/components/Dashboard/Widget";
import { Trail as SpringTail } from "react-spring/renderprops.cjs";
import SimpleMetric from "@/components/DataViz/SimpleMetric";
import StackedBars from "@/components/DataViz/StackedBars";
import AppLayoutGeneral from "@/components/AppLayout/General";
import { useThemeContext } from "@/lib/hooks/useThemeSwitcher";
import useAPI from "@/lib/useApi";
import useDimensions from "@/lib/hooks/useDimensions";
import { setMonthSeriesWithSum } from "@/lib/utils/d3-utils";
import { Alert, AlertTitle } from "@material-ui/lab";

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
  dashboardTitle: {
    color: theme.palette.text.primary,
  },
}));

interface WidgetProps {
  name: string;
  component: React.ReactNode;
  size?: WidgetSizeProps;
}

interface MetricsProps {
  total_tree_count: number;
  logged_trees_count: number;
  planted_trees_count: number;
  planned_interventions_cost: number;
  scheduled_interventions_cost: number;
}
interface WidgetSizeProps {
  xs?: GridSpacing;
  sm?: GridSpacing;
  md?: GridSpacing;
  lg?: GridSpacing;
  xl?: GridSpacing;
}

const ETKDashboard: React.FC<ETKDashboardProps> = (props) => {
  const classes = useStyles();
  const { t } = useTranslation("components");
  const { user } = useAppContext();
  const router = useRouter();
  const { theme } = useThemeContext();
  const [containerRef, containerSize] = useDimensions();
  const colorSchemeInterventions =
    theme.palette.type == "light"
      ? ["#a53b67", "#fbb13c", "#218380", "#2871d1"]
      : ["#a53b67", "#218380", "#2871d1", "#fbb13c"];

  const { api } = useAPI();
  const { apiETK: ecotekaV1 } = api;
  const getOrganizationMetrics = async () => {
    const res = await ecotekaV1.get(
      `organization/${user.currentOrganization.id}/metrics_by_year/2020`
    );
    return res;
  };
  const getInterventions = async () => {
    const res = await ecotekaV1.get(
      `/organization/${user.currentOrganization.id}/interventions/year/2020`
    );
    return res;
  };
  const [interventions, setIterventions] = useState([]);
  const [metrics, setMetrics] = useState({} as MetricsProps);
  const [treeWidgets, setTreeWidgets] = useState([]);
  const [interventionsWidgets, setInterventionsWidgets] = useState(
    [] as WidgetProps[]
  );
  const [activeStep, setActiveStep] = React.useState(0);

  const steps = getSteps();

  function getSteps() {
    return [
      "Configuration de votre espace de travail",
      "Inventaire patrimoine arboré",
      "Pilotage de la gestion",
      "Surveillance de l'état sanitaire",
    ];
  }

  function getStepContent(step) {
    switch (step) {
      case 0:
        return "Configuration de votre espace de travail";
      case 1:
        return "Inventaire patrimoine arboré";
      case 2:
        return "Pilotage de la gestion";
      case 3:
        return "Surveillance de l'état sanitaire";
      default:
        return "Étape non définie";
    }
  }

  useEffect(() => {
    getOrganizationMetrics().then((response) => {
      if (response.status == 200 && user) {
        setMetrics(response.data);
      }
    });
    getInterventions().then((response) => {
      if (response.status == 200 && user) {
        setIterventions(response.data);
      }
    });
  }, [user]);

  useEffect(() => {
    setTreeWidgets([
      {
        name: "a.widget.1",
        component: (
          <SimpleMetric
            caption="Arbres total"
            metric={metrics.total_tree_count}
            icon={
              <IconContext.Provider value={{ size: "3rem" }}>
                <GiFruitTree />
              </IconContext.Provider>
            }
          />
        ),
      },
      {
        name: "a.widget.2",
        component: (
          <SimpleMetric
            caption="Arbres plantés en 2020"
            metric={metrics.planted_trees_count}
            icon={
              <IconContext.Provider value={{ size: "3rem" }}>
                <GiPlantRoots />
              </IconContext.Provider>
            }
          />
        ),
      },
      {
        name: "a.widget.3",
        component: (
          <SimpleMetric
            caption="Arbres abattus en 2020"
            metric={metrics.logged_trees_count}
            icon={
              <IconContext.Provider value={{ size: "3rem" }}>
                <GiLogging />
              </IconContext.Provider>
            }
          />
        ),
      },
    ]);
    if (metrics.total_tree_count > 0) {
      setActiveStep(2);
    } else {
      setActiveStep(0);
    }
  }, [metrics]);

  useEffect(() => {
    if (interventions.length == 0) {
      setInterventionsWidgets([
        {
          name: "a.widget.4",
          size: {
            xs: 6,
          },
          component: (
            <SimpleMetric
              caption="Coût total des interventions planifiées en 2020"
              metric={metrics.planned_interventions_cost}
              icon={<EuroIcon style={{ fontSize: "3rem" }} />}
            />
          ),
        },
        {
          name: "a.widget.5",
          size: {
            xs: 6,
          },
          component: (
            <SimpleMetric
              caption="Coût total des interventions programmées en 2020"
              metric={metrics.scheduled_interventions_cost}
              icon={<EuroIcon style={{ fontSize: "3rem" }} />}
            />
          ),
        },
      ]);
    } else {
      setInterventionsWidgets([
        {
          name: "a.widget.4",
          size: {
            xs: 6,
          },
          component: (
            <SimpleMetric
              caption="Coût total des interventions planifiées en 2020"
              metric={metrics.planned_interventions_cost}
              icon={<EuroIcon style={{ fontSize: "3rem" }} />}
            />
          ),
        },
        {
          name: "a.widget.5",
          size: {
            xs: 6,
          },
          component: (
            <SimpleMetric
              caption="Coût total des interventions programmées en 2020"
              metric={metrics.scheduled_interventions_cost}
              icon={<EuroIcon style={{ fontSize: "3rem" }} />}
            />
          ),
        },
        {
          name: "Budget mensuel des interventions planifiées en 2020",
          size: {
            xs: 12 as GridSpacing,
          },
          component: (
            <StackedBars
              width={1060}
              height={400}
              chartData={setMonthSeriesWithSum(
                interventions,
                "intervention_start_date",
                "intervention_type",
                "estimated_cost",
                2020
              )}
              xScaleKey="date"
              colorScheme={colorSchemeInterventions}
              yScaleUnit="€ HT"
            />
          ),
        },
      ]);
      setActiveStep(3);
    }
  }, [interventions, metrics]);

  return (
    <AppLayoutGeneral>
      <Container ref={containerRef}>
        <Box py={4}>
          <Typography
            className={classes.dashboardTitle}
            variant="h5"
            component="h1"
          >
            {t("Dashboard.title")} 2020 {t("Dashboard.for")}{" "}
            {user?.currentOrganization?.name}
          </Typography>
        </Box>
        <Box>
          <Stepper alternativeLabel activeStep={activeStep}>
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>
        </Box>
        <Box pt={4} pb={2}>
          <Typography
            className={classes.dashboardTitle}
            variant="h6"
            component="h2"
          >
            Votre patrimoine arboré
          </Typography>
        </Box>
        {metrics?.total_tree_count == 0 && (
          <Box pb={2}>
            <Alert
              severity="info"
              action={
                <Button
                  color="inherit"
                  size="small"
                  variant="outlined"
                  onClick={() => router.push("/edition/?panel=import")}
                >
                  Importer des données
                </Button>
              }
            >
              <AlertTitle>
                Ajouter les premiers arbres à votre patrimoine
              </AlertTitle>
              Votre espace de travail ne contient aucun arbre pour l'instant —{" "}
              <strong>Commencer maintenant!</strong>
            </Alert>
          </Box>
        )}
        <Grid container spacing={3}>
          <SpringTail
            items={treeWidgets}
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
                gridProps={{
                  item: true,
                  xs: widget.size?.xs ? widget.size?.xs : 4,
                }}
                paperProps={{
                  elevation: 2,
                }}
                springProps={props}
                component={widget.component}
              >
                {widget.name}
              </Widget>
            )}
          </SpringTail>
        </Grid>

        {interventionsWidgets.length > 0 && (
          <>
            <Box py={4}>
              <Typography
                className={classes.dashboardTitle}
                variant="h6"
                component="h2"
              >
                État de gestion de votre patrimoine
              </Typography>
            </Box>
            {interventions.length == 0 && (
              <Box pb={2}>
                <Alert
                  severity="info"
                  action={
                    <Button
                      color="inherit"
                      size="small"
                      variant="outlined"
                      disabled={Boolean(metrics.total_tree_count == 0)}
                      onClick={() =>
                        router.push("/edition/?panel=intervention")
                      }
                    >
                      Ajouter des interventions
                    </Button>
                  }
                >
                  <AlertTitle>
                    Ajouter, programmer et suivre le budget des interventions
                    sur votre patrimoine
                  </AlertTitle>
                  Dès que votre espace de travail contiendra des arbres, vous
                  pourrez débuter la gestion de votre patrimoine végétal —{" "}
                  <strong>En savoir plus!</strong>
                </Alert>
              </Box>
            )}
            <Grid container spacing={3}>
              <SpringTail
                items={interventionsWidgets}
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
                    gridProps={{
                      item: true,
                      xs: widget.size?.xs ? widget.size?.xs : 4,
                    }}
                    paperProps={{
                      elevation: 2,
                    }}
                    springProps={props}
                    component={widget.component}
                  >
                    {widget.name}
                  </Widget>
                )}
              </SpringTail>
            </Grid>
          </>
        )}
      </Container>
    </AppLayoutGeneral>
  );
};

ETKDashboard.defaultProps = defaultProps;

export default ETKDashboard;
