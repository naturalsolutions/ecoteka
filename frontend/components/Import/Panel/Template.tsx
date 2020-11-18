import React from "react";
import {
  Button,
  Typography,
  Grid,
  Box,
  Card,
  CardContent,
  makeStyles,
} from "@material-ui/core";
import { useTranslation } from "react-i18next";

export interface ETKImportTemplateProps {
  linkTemplate?: string;
}

const defaultProps: ETKImportTemplateProps = {
  linkTemplate:
    "https://raw.githubusercontent.com/NaturalSolutions/schema-arbre/v0.2.0/exemple-valide.xlsx",
};

const useStyle = makeStyles((theme) => ({
  content: {
    backgroundColor: theme.palette.secondary.main,
  },
}));

const ETKImportTemplate: React.FC<ETKImportTemplateProps> = (props) => {
  const { t } = useTranslation("components");
  const classes = useStyle();

  return (
    <Grid container direction="column" alignItems="stretch">
      <Grid item>
        <Card className={classes.content}>
          <CardContent>
            <Typography variant="h6">{t("ImportTemplate.title")}</Typography>
            <Typography>{t("ImportTemplate.content")}</Typography>
            <Grid>
              <Typography>- {t("ImportTemplate.latitude")}</Typography>
              <Typography>- {t("ImportTemplate.longitude")}</Typography>
              <Typography>- {t("ImportTemplate.crs")}</Typography>
            </Grid>
          </CardContent>
        </Card>
      </Grid>
      <Grid item>
        <Box mt={3} mb={1}>
          <Typography>{t("ImportTemplate.download")}</Typography>
        </Box>
      </Grid>
      <Grid item>
        <Grid container direction="row-reverse">
          <Grid item>
            <Button
              variant="outlined"
              size="large"
              color="primary"
              href={props.linkTemplate}
              target="_blank"
            >
              {t("ImportTemplate.button")}
            </Button>
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
};

ETKImportTemplate.defaultProps = defaultProps;

export default ETKImportTemplate;
