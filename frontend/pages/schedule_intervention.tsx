import { useState, useEffect, Fragment } from "react";
import {
  Checkbox,
  Grid,
  Box,
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

const useStyles = makeStyles((theme) => ({
  root: {
    height: "100%",
    width: "100%",
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
  const [values, setValues] = useState([]);
  const [year, setYear] = useState(new Date().getFullYear());
  const [itypes, setItypes] = useState(interventionTypes);
  const [calendarData, setCalendarData] = useState({} as any);

  const mockdata = () => {
    const size = 30;
    const result = [];
    const ninter = itypes.length;

    function getRandomInt(max) {
      return Math.floor(Math.random() * Math.floor(max));
    }

    for (let i = 0; i < size; i++) {
      const m = getRandomInt(12);
      const startDate = new Date(`${year}-${m}-${1}`),
        endDate = new Date(`${year}-${m}-${12}`);

      result.push({
        intervention_type: itypes[getRandomInt(ninter)],
        intervention_period: { startDate, endDate },
        date:
          Math.random() >= 0.5
            ? new Date(`${year}-${m}-${getRandomInt(28)}`)
            : null,
        done: Math.random() >= 0.5,
      });
    }
    return result;
  };

  const getCalendarData = (year) => {
    const result = {},
      data = mockdata();

    data.forEach((it) => {
      const startmonth = it.intervention_period.startDate.getMonth(),
        endmonth = it.intervention_period.endDate.getMonth();

      result[startmonth] = (result[startmonth] || []).concat(it);

      if (startmonth !== endmonth) {
        result[endmonth] = (result[endmonth] || []).concat(it);
      }
    });

    return result;
  };

  useEffect(() => {
    const newValues = [];

    for (let m = 0; m < 12; m++) {
      newValues[m] = new Date(`${year}-${to2d(m + 1)}-01`);
    }

    setValues(newValues);

    const newCalendarData = getCalendarData(year);

    setCalendarData(newCalendarData);
  }, [year]);

  const handleCheckboxChange = (e, it: TInterventionType) => {
    const value = e.target.checked;

    if (value) {
      setItypes(itypes.concat([it]));
    } else {
      setItypes(itypes.filter((i) => i !== it));
    }
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
          calendarData={calendarData}
          interventionColors={interventionColors}
          itypes={itypes}
          values={values}
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
                    {renderItems()}
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
