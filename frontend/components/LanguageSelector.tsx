import { FC, useState } from "react";
import { useTranslation } from "react-i18next";
import { FormControl, Button, Menu, MenuItem } from "@material-ui/core";

const ETKLanguageSelector: FC = () => {
  const { t, i18n } = useTranslation("components");
  const [anchorEl, setAnchorEl] = useState(null);

  const handlerLanguage = (value) => {
    i18n.changeLanguage(value);
    setAnchorEl(null);
  };

  return (
    <FormControl>
      <Button
        variant="outlined"
        size="small"
        aria-controls="simple-menu"
        aria-haspopup="true"
        onClick={(e) => setAnchorEl(e.currentTarget)}
      >
        {i18n.language}
      </Button>
      <Menu
        id="simple-menu"
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
      >
        <MenuItem onClick={() => handlerLanguage("en")}>
          {t("LanguageSelector.en")}
        </MenuItem>
        <MenuItem onClick={() => handlerLanguage("fr")}>
          {t("LanguageSelector.fr")}
        </MenuItem>
        <MenuItem onClick={() => handlerLanguage("es")}>
          {t("LanguageSelector.es")}
        </MenuItem>
      </Menu>
    </FormControl>
  );
};

export default ETKLanguageSelector;
