import { FC, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  FormControl,
  IconButton,
  Menu,
  MenuItem,
  Typography,
} from "@material-ui/core";

const LanguageSelector: FC = () => {
  const { t, i18n } = useTranslation("components");
  const [anchorEl, setAnchorEl] = useState(null);

  const handlerLanguage = (value) => {
    i18n.changeLanguage(value);
    setAnchorEl(null);
  };

  return (
    <FormControl>
      <IconButton onClick={(e) => setAnchorEl(e.currentTarget)}>
        <Typography>{i18n.language}</Typography>
      </IconButton>
      <Menu
        id="simple-menu"
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
      >
        <MenuItem onClick={() => handlerLanguage("en")}>
          {t("components.LanguageSelector.en")}
        </MenuItem>
        <MenuItem onClick={() => handlerLanguage("fr")}>
          {t("components.LanguageSelector.fr")}
        </MenuItem>
        <MenuItem onClick={() => handlerLanguage("es")}>
          {t("components.LanguageSelector.es")}
        </MenuItem>
      </Menu>
    </FormControl>
  );
};

export default LanguageSelector;
