import React, { useState } from "react";
import { ButtonGroup, Button } from "@material-ui/core";
import { makeStyles, Theme, createStyles } from "@material-ui/core/styles";
import { useTranslation } from "react-i18next";
import ETKMap from "./Map";

export interface ETKMapSateliteToggleProps {
  map: React.RefObject<ETKMap>;
}

const defaultProps: ETKMapSateliteToggleProps = {
  map: undefined,
};

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    buttonGroup: {
      position: "absolute",
      bottom: theme.spacing(2),
      left: theme.spacing(2),
    },
  })
);

const ETKMapSateliteToggle: React.FC<ETKMapSateliteToggleProps> = (props) => {
  const { t } = useTranslation("components");
  const classes = useStyles();
  const [active, setActive] = useState("map");

  function onClickHandler(newActive) {
    setActive(newActive);

    props.map.current.map.setLayoutProperty(
      "satellite",
      "visibility",
      newActive === "map" ? "none" : "visible"
    );
  }

  return (
    <ButtonGroup
      disableElevation
      variant="outlined"
      className={classes.buttonGroup}
    >
      <Button
        variant={active === "map" ? "contained" : "outlined"}
        color="secondary"
        onClick={() => onClickHandler("map")}
      >
        {t("Map.SateliteToggle.map")}
      </Button>
      <Button
        variant={active === "satelite" ? "contained" : "outlined"}
        color="secondary"
        onClick={() => onClickHandler("satelite")}
      >
        {t("Map.SateliteToggle.satellite")}
      </Button>
    </ButtonGroup>
  );
};

ETKMapSateliteToggle.defaultProps = defaultProps;

export default ETKMapSateliteToggle;
