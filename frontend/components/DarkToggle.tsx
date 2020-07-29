import IconButton from "@material-ui/core/IconButton";
import Brightness4OutlinedIcon from "@material-ui/icons/Brightness4Outlined";
import Brightness4Icon from "@material-ui/icons/Brightness4";
import { useState } from "react";

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
    <IconButton onClick={onClickHandler}>
      {dark ? <Brightness4Icon /> : <Brightness4OutlinedIcon />}
    </IconButton>
  );
};

export default ETKDarkToggle;
