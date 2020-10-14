import { useTranslation } from "react-i18next";
import { FormControl, Select, MenuItem } from "@material-ui/core";

const ETKLanguageSelector: React.FC = () => {
  const { t, i18n } = useTranslation("components");

  const onChangeLanguage = (e) => {
    i18n.changeLanguage(e.target.value);
  };

  return (
    <FormControl>
      <Select value={i18n.language} onChange={onChangeLanguage}>
        <MenuItem value="en">{t("LanguageSelector.en")}</MenuItem>
        <MenuItem value="fr">{t("LanguageSelector.fr")}</MenuItem>
        <MenuItem value="es">{t("LanguageSelector.es")}</MenuItem>
      </Select>
    </FormControl>
  );
};

export default ETKLanguageSelector;
