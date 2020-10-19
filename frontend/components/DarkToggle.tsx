import WbSunnyIcon from "@material-ui/icons/WbSunny";
import Brightness3Icon from "@material-ui/icons/Brightness3";
import { useState } from "react";
import { Switch, Grid } from "@material-ui/core";
import { useAppContext } from "../providers/AppContext";

const ETKDarkToggle: React.FC = () => {
  const [dark, setDark] = useState(false);
  const { setAppContext } = useAppContext();

  function onClickHandler() {
    setDark(!dark);
    setAppContext({
      theme: dark ? "light" : "dark",
    });
  }

  return (
    <Grid container alignItems="center">
      <Brightness3Icon color="secondary" style={{ fontSize: 18 }} />
      <Switch checked={!dark} color="secondary" onChange={onClickHandler} />
      <WbSunnyIcon color="secondary" style={{ fontSize: 18 }} />
    </Grid>
  );
};

export default ETKDarkToggle;
