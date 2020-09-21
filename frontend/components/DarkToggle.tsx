import Icon from "@material-ui/core/Icon";
import WbSunnyIcon from "@material-ui/icons/WbSunny";
import Brightness3Icon from "@material-ui/icons/Brightness3";
import { useState } from "react";
import { Switch, Grid } from "@material-ui/core";

export interface ETKDarkToggleProps {
  onToggle?(dark: boolean): void;
}

const ETKDarkToggle: React.FC<ETKDarkToggleProps> = (props) => {
  const [dark, setDark] = useState(false);

  function onClickHandler() {
    setDark(!dark);
    props.onToggle(dark);
  }

  return (
    <Grid container alignItems="center">
      <Brightness3Icon style={{ fontSize: 18 }} />
      <Switch checked={!dark} color="primary" onChange={onClickHandler} />
      <WbSunnyIcon style={{ fontSize: 18 }} />
    </Grid>
  );
};

export default ETKDarkToggle;
