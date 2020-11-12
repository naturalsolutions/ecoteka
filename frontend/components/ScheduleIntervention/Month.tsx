import React from "react";
import { makeStyles, Grid, Typography, Box } from "@material-ui/core";
import Calendar from "react-calendar";
import { useTranslation } from "react-i18next";
import { useTemplate } from "../Template";
import { ItemTypes } from "./ItemTypes";
import { useDrag, useDrop } from "react-dnd";
import { TIntervention } from "../Interventions/Schema";
import HeaderTileBox from "./HeaderTileBox";
import Tile from "./Tile";

export interface ETKScheduleInterventionProps {
  idx?: number;
  calendarData?: any;
  interventionColors?: any;
  itypes?: any;
  onInterventionPlanified?(intervention: any, month: number): void;
}

const defaultProps: ETKScheduleInterventionProps = {};

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
  ".react-calendar__month-view__days__day": {
    position: "relative",
  },
}));

//Renvoie une date au format yyyy-mm-dd
function dateToString(date: Date) {
  function to2d(d: number) {
    return d < 10 ? "0" + d : String(d);
  }

  return `${date.getFullYear()}-${to2d(date.getMonth() + 1)}-${to2d(
    date.getDate()
  )}`;
}

function dateEqual(d1: Date, d2: Date) {
  return dateToString(d1) === dateToString(d2);
}

const ETKScheduleIntervention: React.FC<ETKScheduleInterventionProps> = (
  props
) => {
  const classes = useStyles();
  const { dialog } = useTemplate();
  const { t } = useTranslation();

  const onClickDay = () => {
    dialog.current.open({
      title: "Titldfsfsde",
      date: "test",
      item: "item",
      onInterventionPlanified: props.onInterventionPlanified,
    });
  };

  const renderMonthInterventionBoxes = (month: number) => {
    const items = props.calendarData?.filter(
      (item) =>
        !Boolean(item.date) && props.itypes.includes(item.intervention_type)
    );

    if (!items?.length) {
      return;
    }

    return (
      <Grid container spacing={1}>
        {items.map((item, i) => (
          <HeaderTileBox
            key={i}
            itemId={item.id}
            backgroundColor={props.interventionColors[item.intervention_type]}
          />
        ))}
      </Grid>
    );
  };

  return (
    <Grid item xs={3}>
      <Grid container direction="column">
        <Grid item>
          <Grid container spacing={1} alignItems="center">
            <Grid item>
              <Typography className={classes.titleMonth}>
                {t("common:months", { returnObjects: true })[props.idx]}
              </Typography>
            </Grid>
            <Grid item>{renderMonthInterventionBoxes(props.idx)}</Grid>
          </Grid>
        </Grid>
        <Grid item>
          <Calendar
            tileContent={({ date }) => {
              let item;

              if (props.calendarData && props.calendarData.length) {
                item = props.calendarData
                  .filter((i) => {
                    if (!i.date) return false;
                    return i.date.toDateString() === new Date(date).toDateString();
                  })
                  .pop();
              }

              return <Tile
                date={date}
                item={item}
                onInterventionPlanified={props.onInterventionPlanified} />
            }}
            showNavigation={false}
            view="month"
            onClickDay={() => onClickDay()}
          />
        </Grid>
      </Grid>
    </Grid>
  );
};

ETKScheduleIntervention.defaultProps = defaultProps;

export default ETKScheduleIntervention;
