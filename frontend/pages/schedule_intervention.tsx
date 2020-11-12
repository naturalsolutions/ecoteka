import { useState, useEffect } from "react";
import {
  Checkbox,
  Grid,
  IconButton,
  List,
  Card,
  CardContent,
  ListItem,
  FormLabel,
  makeStyles,
  Typography,
} from "@material-ui/core";
import { ArrowBackIos, ArrowForwardIos } from "@material-ui/icons";
import {
  interventionTypes,
  TInterventionType,
} from "../components/Interventions/Schema";
import { useTranslation } from "react-i18next";
import Template from "../components/Template";
import ScheduleInterventionMonth from "../components/ScheduleIntervention/Month";
import { HTML5Backend } from "react-dnd-html5-backend";
import { DndProvider } from "react-dnd";
import { apiRest } from "../lib/api";

const useStyles = makeStyles((theme) => ({
  root: {
    height: "100%",
    width: "100%",

    "& .react-calendar__month-view__days__day": {
      position: "relative",
    },
  },
  gridMain: {
    height: "100%",
    width: "100%",
  },
  gridItems: {},
  sidebar: {
    width: "20rem",
  },
  yearTitle: {
    fontWeight: "bold",
    fontSize: "1.2rem",
  },
  titleMonth: {
    fontWeight: "bold",
  },
}));

const interventionColors = {
  pruning: "green",
  felling: "red",
  streanremoval: "brown",
  indepthdiagnostic: "purple",
  treatment: "orange",
  surveillance: "blue",
};

function to2d(n) {
  return n < 10 ? "0" + n : n;
}

export default function ScheduleInterventionPage() {
  const classes = useStyles();
  const { t } = useTranslation(["common", "components"]);
  const [year, setYear] = useState(new Date().getFullYear());
  const [itypes, setItypes] = useState(interventionTypes);
  const [calendarData, setCalendarData] = useState({} as any);

  const getCalendarData = async (year) => {
    const result = {};
    const data = await apiRest.interventions.getByYear(year);

    data.forEach((it) => {
      const r = {
        ...it,
        intervention_start_date: new Date(it.intervention_start_date),
        intervention_end_date: new Date(it.intervention_end_date),
        date: it.date ? new Date(it.date) : null,
      };
      const startmonth = r.intervention_start_date.getMonth(),
        endmonth = r.intervention_end_date.getMonth();

      for (let i = startmonth; i <= endmonth; i++) {
        result[i] = (result[i] || []).concat(r);
      }
    });

    return result;
  };

  useEffect(() => {
    getCalendarData(year).then((newCalendarData) => {
      setCalendarData(newCalendarData);
    });
  }, [year]);

  const handleCheckboxChange = (e, it: TInterventionType) => {
    const value = e.target.checked;

    if (value) {
      setItypes(itypes.concat([it]));
    } else {
      setItypes(itypes.filter((i) => i !== it));
    }
  };

  const onInterventionPlanified = async () => {
    const newCalendarData = await getCalendarData(year);

    setCalendarData(newCalendarData);
  };

  const renderYearHeader = () => {
    return (
      <Grid container justify="center" alignItems="center" spacing={2}>
        <Grid item>
          <IconButton onClick={() => setYear(year - 1)}>
            <ArrowBackIos />
          </IconButton>
        </Grid>
        <Grid item>
          <Typography className={classes.yearTitle}>{year}</Typography>
        </Grid>
        <Grid item>
          <IconButton onClick={() => setYear(year + 1)}>
            <ArrowForwardIos />
          </IconButton>
        </Grid>
      </Grid>
    );
  };

  const renderItems = () => {
    const items = [];

    for (let i = 0; i < 12; i++) {
      items.push(
        <ScheduleInterventionMonth
          key={`schedule-intervention-month-${i}`}
          idx={i}
          calendarData={calendarData[i]}
          interventionColors={interventionColors}
          itypes={itypes}
          onInterventionPlanified={onInterventionPlanified}
        />
      );
    }

    return items;
  };

  return (
    <Template>
      <Card square className={classes.root}>
        <CardContent>
          <Grid container className={classes.gridMain}>
            <Grid item className={classes.sidebar}>
              <Grid container direction="column">
                <Grid item>
                  <Typography variant="h6">
                    {t("ScheduleInterventionPage.title")}
                  </Typography>
                </Grid>
                <Grid item>
                  <List>
                    {interventionTypes.map((it) => (
                      <ListItem key={`list-item-${it}`}>
                        <Checkbox
                          style={{ color: interventionColors[it] }}
                          checked={itypes.includes(it)}
                          id={`checkbox-for-${it}`}
                          onChange={(e) => handleCheckboxChange(e, it)}
                        />
                        <FormLabel htmlFor={`checkbox-for-${it}`}>
                          {t(`components:Intervention.types.${it}`)}
                        </FormLabel>
                      </ListItem>
                    ))}
                  </List>
                </Grid>
              </Grid>
            </Grid>
            <Grid item xs>
              <Grid container spacing={2} direction="column">
                <Grid item>{renderYearHeader()}</Grid>
                <Grid item xs className={classes.gridItems}>
                  <Grid container spacing={2}>
                    <DndProvider backend={HTML5Backend}>
                      {renderItems()}
                    </DndProvider>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </Template>
  );
}
