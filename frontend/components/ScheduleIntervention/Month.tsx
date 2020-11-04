import React from "react";
import { makeStyles, Grid, Typography, Box } from "@material-ui/core";
import Calendar from "react-calendar";
import { useTranslation } from "react-i18next";
import { useTemplate } from "../Template";
import { ItemTypes } from "./ItemTypes";
import { useDrag, useDrop } from "react-dnd";
import { TIntervention } from "../Interventions/Schema";
import HeaderTileBox from "./HeaderTileBox";
import B from "./B";

export interface ETKScheduleInterventionProps {
  idx?: number;
  values?: any;
  calendarData?: any;
  interventionColors?: any;
  itypes?: any;
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

const ETKScheduleIntervention: React.FC<ETKScheduleInterventionProps> = (
  props
) => {
  const classes = useStyles();
  const { dialog } = useTemplate();
  const { t } = useTranslation();

  const onClickDay = () => {
    dialog.current.open({
      title: "Title",
      content: "ddd",
      actions: [{ label: "ssss" }],
    });
  };

  const renderTileContent = ({ date }) => {
    return <B key={`date-${date}`} />;
    if (!props.calendarData[date.getMonth()]) {
      return;
    }

    const items = props.calendarData[date.getMonth()].filter(
      (item) =>
        item.date?.getDate() === date.getDate() &&
        Boolean(item.date) &&
        props.itypes.includes(item.intervention_type)
    );

    return (
      <Grid container>
        {items.map((item, i) => (
          <Box
            key={`tile-content-${i}`}
            style={{
              backgroundColor: props.interventionColors[item.intervention_type],
              width: "5px",
              height: "5px",
              margin: "0 2px 2px 0",
              borderRadius: item.done ? "50%" : "unset",
            }}
          />
        ))}
      </Grid>
    );
  };

  const renderMonthInterventionBoxes = (month: number) => {
    const items = props.calendarData[month]?.filter(
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
            itemId={i}
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
            tileContent={renderTileContent}
            showNavigation={false}
            view="month"
            activeStartDate={props.values[props.idx]}
            onClickDay={() => onClickDay()}
          />
        </Grid>
      </Grid>
    </Grid>
  );
};

ETKScheduleIntervention.defaultProps = defaultProps;

export default ETKScheduleIntervention;
