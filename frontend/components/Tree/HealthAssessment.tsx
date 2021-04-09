import { FC } from "react";
import {
  Box,
  Grid,
  makeStyles,
  Theme,
  Typography,
  Button,
  LinearProgress,
} from "@material-ui/core";
import CoreOptionsPanel from "../Core/OptionsPanel";
import { useTranslation } from "react-i18next";
import TreeImage from "@/public/assets/health_assessment/tree.svg";
import CoreTextField from "../Core/Field/TextField";
import { useAppContext } from "@/providers/AppContext";

export interface TreeHealthAssessmentProps {
  treeId: number;
}

const useStyles = makeStyles((theme: Theme) => ({
  root: {},
  legendColor: {
    width: 14,
    height: 15,
    marginRight: 10,
  },
  low: {
    color: "#24B383",
  },
  treeImage: {
    "& > path:nth-child(4)": {
      fill: "#d29e57",
    },
  },
}));

const legend = [
  { color: "#76923C", title: "Excellent" },
  { color: "#C2D69B", title: "Bon" },
  { color: "#FABF8F", title: "Médiocre" },
  { color: "#FF0000", title: "Mauvais" },
  { color: "#000", title: "Très mauvais" },
];

const TreeHealthAssessment: FC<TreeHealthAssessmentProps> = ({ treeId }) => {
  const classes = useStyles();
  const { t } = useTranslation();

  const items = [
    { title: "Liste des états sanitaires", href: "" },
    {
      title: "Nouvel état sanitaire",
      href: "",
    },
  ];

  return (
    <CoreOptionsPanel
      items={items}
      title={t("components.TreeHealthAssessment.title")}
    >
      <Grid container className={classes.root}>
        <Grid item>
          <Grid container justify="center" alignItems="center">
            <TreeImage className={classes.treeImage} />
          </Grid>
        </Grid>
        <Box mx={1} />
        <Grid item xs>
          <Grid container direction="column" spacing={1}>
            <Grid item>
              <CoreTextField label={t("components.Intervention.date")} />
            </Grid>
            <Grid item>
              <Grid container justify="space-between">
                <Grid item>
                  <Typography variant="caption">{t("common.risk")}</Typography>
                </Grid>
                <Grid item>
                  <Typography variant="caption" className={classes.low}>
                    {t("common.low")} (20%)
                  </Typography>
                </Grid>
              </Grid>
            </Grid>
            <Grid item>
              <LinearProgress variant="determinate" value={20} />
            </Grid>
            <Grid item>
              <Grid container direction="column">
                <Grid item>
                  <Typography variant="caption">
                    {t("common.legend")}
                  </Typography>
                </Grid>
                {legend.map((item) => (
                  <Grid item key={item.title}>
                    <Grid container justify="center" alignItems="center">
                      <Grid item>
                        <Box
                          className={classes.legendColor}
                          style={{ background: item.color }}
                        />
                      </Grid>
                      <Grid item xs>
                        <Typography variant="caption">{item.title}</Typography>
                      </Grid>
                    </Grid>
                  </Grid>
                ))}
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
      <Box my={2} />
      <Button size="large" color="primary" variant="contained" fullWidth>
        {t("common.buttons.viewAll")}
      </Button>
    </CoreOptionsPanel>
  );
};

export default TreeHealthAssessment;
