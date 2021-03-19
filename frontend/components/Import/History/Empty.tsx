import React from "react";
import { makeStyles, Grid, Typography, Button, Box } from "@material-ui/core";
import { useTranslation, Trans } from "react-i18next";
import { useRouter } from "next/router";
import { useAppContext } from "@/providers/AppContext";

export interface ETKImportHistoryEmptyProps {}

const defaultProps: ETKImportHistoryEmptyProps = {};

const useStyles = makeStyles(() => ({
  content: {
    fontSize: "1.5rem",
    fontStyle: "italic",
    fontWeight: "bold",
    letterSpacing: "2px",
  },

  grid: {
    height: "100%",
    width: "100%",
    background: `no-repeat center url('../assets/background_importhistoryempty.png')`,
    backgroundPosition: "center",
    backgroundSize: "contain",
  },
}));

const ETKImportHistoryEmpty: React.FC<ETKImportHistoryEmptyProps> = (props) => {
  const classes = useStyles();
  const router = useRouter();
  const { t } = useTranslation("components");
  const { organization } = useAppContext();

  return (
    <Grid
      container
      direction="column"
      justify="flex-start"
      alignItems="center"
      spacing={2}
      className={classes.grid}
    >
      <Grid item>
        <Box mt={15}>
          <Typography paragraph align="center" className={classes.content}>
            <Trans>{t("ImportHistoryEmpty.content")}</Trans>
          </Typography>
        </Box>
      </Grid>
      <Grid item>
        <Button
          variant="contained"
          color="primary"
          size="large"
          onClick={() => {
            router.push({
              pathname: "/[organizationSlug]/map",
              query: {
                panel: "import",
                organizationSlug: organization.id,
              },
            });
          }}
        >
          {t("ImportHistoryEmpty.button")}
        </Button>
      </Grid>
    </Grid>
  );
};

ETKImportHistoryEmpty.defaultProps = defaultProps;

export default ETKImportHistoryEmpty;
