import { FC } from "react";
import { makeStyles, Theme, Grid, Button, Box, Badge } from "@material-ui/core";
import CoreOptionsPanel from "../Core/OptionsPanel";
import { useTranslation } from "react-i18next";
import { useAppContext } from "@/providers/AppContext";
import { useEffect } from "react";
import useInterventions from "@/lib/hooks/useInterventions";
import useApi from "@/lib/useApi";
import { useState } from "react";
import InterventionIcon01 from "@/public/assets/interventions/intervention-01.svg";
import InterventionIcon02 from "@/public/assets/interventions/intervention-02.svg";
import InterventionIcon03 from "@/public/assets/interventions/intervention-03.svg";
import InterventionIcon04 from "@/public/assets/interventions/intervention-04.svg";
import InterventionIcon05 from "@/public/assets/interventions/intervention-05.svg";
import InterventionIcon06 from "@/public/assets/interventions/intervention-06.svg";
import { TIntervention, TInterventionType } from "../Interventions/Schema";
import { useRouter } from "next/router";
import { useTreeContext } from "@/components/Tree/Provider";

export interface TreeInterventionsProps {}

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    [theme.breakpoints.up("sm")]: {
      minHeight: 252,
    },
  },
  intervention: {
    borderRadius: 5,
    height: 95,
    width: 95,
    backgroundColor: theme.palette.background.paper,
    padding: theme.spacing(3),
    cursor: "pointer",
  },
  interventionIcon: {
    "& > path": {
      fill: theme.palette.text.primary,
    },
  },
  pruning: {
    backgroundColor: "#1d675b",
    color: theme.palette.getContrastText("#1d675b"),
  },
  felling: {
    backgroundColor: "#ff0000",
    color: theme.palette.getContrastText("#ff0000"),
  },
  streanremoval: {
    backgroundColor: "#a52a2a",
    color: theme.palette.getContrastText("#a52a2a"),
  },
  indepthdiagnostic: {
    backgroundColor: "#800080",
    color: theme.palette.getContrastText("#800080"),
  },
  treatment: {
    backgroundColor: "#f9a500",
    color: theme.palette.getContrastText("#f9a500"),
  },
  surveillance: {
    backgroundColor: "#0000ff",
    color: theme.palette.getContrastText("#0000ff"),
  },
}));

const icons = {
  pruning: InterventionIcon01,
  felling: InterventionIcon02,
  streanremoval: InterventionIcon03,
  indepthdiagnostic: InterventionIcon04,
  treatment: InterventionIcon05,
  surveillance: InterventionIcon06,
};

const TreeInterventions: FC<TreeInterventionsProps> = () => {
  const classes = useStyles();
  const { t } = useTranslation();
  const { organization } = useAppContext();
  const { apiETK } = useApi().api;
  const fetchInterventions = useInterventions(apiETK);
  const { tree } = useTreeContext();

  const [interventions, setInterventions] =
    useState<Record<TInterventionType, TIntervention[]>>(null);
  const router = useRouter();

  const items = [
    { title: "Liste des interventions", href: "" },
    {
      title: "Planifier une intervention",
      href: `/${organization.slug}/map?panel=intervention&tree=${tree?.id}`,
    },
  ];

  const handleOnClick = (interventionType: TInterventionType) => {
    if (interventions[interventionType].length === 1) {
      router.push({
        pathname: `/${organization.slug}/map`,
        query: {
          panel: "intervention-edit",
          tree: tree?.id,
          intervention: interventions[interventionType][0].id,
        },
      });
    }
  };

  const handleNewIntervention = (href) => {
    router.push(href);
  };

  useEffect(() => {
    if (tree?.id) {
      (async () => {
        const newInterventions = await fetchInterventions(
          organization.id,
          String(tree.id)
        );

        setInterventions(
          newInterventions?.reduce((acc, item) => {
            const interventionType = item.intervention_type;

            if (!acc[interventionType]) {
              acc[interventionType] = [];
            }

            acc[interventionType].push(item);

            return acc;
          }, {}) as Record<TInterventionType, TIntervention[]>
        );
      })();
    }
  }, [tree?.id]);

  return (
    <CoreOptionsPanel
      items={items}
      title={t("components.TreeInterventions.title")}
    >
      {interventions && Object.keys(interventions).length > 0 ? (
        <>
          <Grid container spacing={2} className={classes.root}>
            {interventions &&
              Object.keys(interventions).map(
                (intervention: TInterventionType) => {
                  const Icon = icons[intervention];

                  return (
                    <Grid item key={intervention}>
                      <Badge
                        classes={{ badge: classes[intervention] }}
                        badgeContent={interventions[intervention].length}
                      >
                        <Box
                          className={classes.intervention}
                          onClick={() => handleOnClick(intervention)}
                        >
                          <Icon className={classes.interventionIcon} />
                        </Box>
                      </Badge>
                    </Grid>
                  );
                }
              )}
          </Grid>
          <Box my={2} />
          <Button size="large" color="primary" variant="contained" fullWidth>
            {t("common.buttons.viewAll")}
          </Button>
        </>
      ) : (
        <Grid
          container
          direction="column"
          className={classes.root}
          justify="center"
        >
          <Grid item>
            <Button
              size="large"
              color="primary"
              variant="contained"
              fullWidth
              onClick={() => handleNewIntervention(items[1].href)}
            >
              {items[1].title}
            </Button>
          </Grid>
        </Grid>
      )}
    </CoreOptionsPanel>
  );
};

export default TreeInterventions;
