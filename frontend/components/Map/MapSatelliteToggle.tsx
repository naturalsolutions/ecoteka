import { useState } from "react";
import { ButtonGroup, Button } from "@material-ui/core";
import { makeStyles, Theme, createStyles } from "@material-ui/core/styles";

export interface ETKMapSateliteToggleProps {
  onToggle?(active: string): void;
}

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
  const classes = useStyles();
  const [active, setActive] = useState("map");

  function onClickHandler(active) {
    setActive(active);

    if (props.onToggle) {
      props.onToggle(active);
    }
  }

  return (
    <ButtonGroup
      disableElevation
      variant="contained"
      className={classes.buttonGroup}
    >
      <Button
        color={active === "map" ? "primary" : null}
        onClick={() => onClickHandler("map")}
      >
        Map
      </Button>
      <Button
        color={active === "satelite" ? "primary" : null}
        onClick={() => onClickHandler("satelite")}
      >
        Satelite
      </Button>
    </ButtonGroup>
  );
};

export default ETKMapSateliteToggle;
