import { FC } from "react";
import { Button, Grid, makeStyles, Theme, Typography } from "@material-ui/core";
import { useTranslation } from "react-i18next";
import Seed from "@/public/assets/icons/icon_seed.svg";

export interface WorkInProgressProps {
  withHref?: boolean;
  href?: string;
}

const useStyles = makeStyles((theme: Theme) => ({
  root: {},
}));

const WorkInProgress: FC<WorkInProgressProps> = ({
  withHref = false,
  href,
}) => {
  const classes = useStyles();
  const { t } = useTranslation(["components"]);

  return (
    <Grid
      container
      direction="column"
      justify="center"
      alignItems="center"
      spacing={4}
    >
      <Grid item>
        <Seed />
      </Grid>
      <Grid item>
        <Typography variant="button" display="block" gutterBottom>
          {t("components.WorkInProgress.title")}
        </Typography>
      </Grid>
      {withHref && (
        <Button
          variant="contained"
          color="primary"
          href={href ? href : "#"}
          target="_blank"
        >
          {t("components.WorkInProgress.knowMore")}
        </Button>
      )}
      <Grid item></Grid>
    </Grid>
  );
};

export default WorkInProgress;
