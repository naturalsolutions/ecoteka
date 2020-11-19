import React, { useEffect, useState } from "react";
import {
  makeStyles,
  Grid,
  Typography,
  Box,
  Card,
  CardContent,
  Button,
} from "@material-ui/core";
import { apiRest } from "@/lib/api";
import { useTranslation } from "react-i18next";
import { useAppContext } from "@/providers/AppContext";
import CardInfoPanel from "@/components/Card/InfoPanel";
import { useRouter } from "next/router";

export interface ETKPanelStartGeneralInfoProps {}

const defaultProps: ETKPanelStartGeneralInfoProps = {};

const useStyles = makeStyles((theme) => ({
  root: {
    width: "25rem",
    height: "100%",
  },
  card: {
    backgroundColor: theme.palette.secondary.main,
  },
  cardTitle: {
    fontWeight: "bold",
  },
}));

async function fetchData(organizationId: number) {
  try {
    const response = await apiRest.organization.get(organizationId);

    if (response.ok) {
      const organization = await response.json();

      return organization;
    }
  } catch (e) {}
}

interface Organization {
  id: number;
  name: string;
  slug: string;
  total_trees: number;
}

const ETKPanelStartGeneralInfo: React.FC<ETKPanelStartGeneralInfoProps> = (
  props
) => {
  const router = useRouter();
  const classes = useStyles();
  const { user } = useAppContext();
  const [organization, setOrganization] = useState<Organization>();
  const { t } = useTranslation("components");

  useEffect(() => {
    fetchData(user.organization_id).then((newOrganization) => {
      setOrganization(newOrganization);
    });
  }, []);

  return (
    <Grid container direction="column" spacing={2} className={classes.root}>
      <Grid item>
        <Typography variant="h5">{t("PanelStart.title")}</Typography>
      </Grid>
      <Grid item>
        <Typography>{t("PanelStart.content")}</Typography>
      </Grid>
      <Grid item>
        <CardInfoPanel
          title={t("PanelStart.numberOfTrees.title")}
          content={`14.5 ${t("PanelStart.numberOfTrees.content")}`}
        />
      </Grid>
      <Grid item>
        <CardInfoPanel
          title={t("PanelStart.numberOfTreesLayer.title")}
          content={`${organization ? organization.total_trees : 0} ${t(
            "PanelStart.numberOfTreesLayer.content"
          )}`}
        />
      </Grid>
      <Grid item xs />
      <Grid item>
        <Card className={classes.card}>
          <CardContent>
            <Grid container direction="column" alignItems="center" spacing={2}>
              <Grid item>
                <Typography className={classes.cardTitle} variant="h6">
                  {t("PanelStart.card.title")}
                </Typography>
              </Grid>
              <Grid item>
                <Typography>{t("PanelStart.card.content")}</Typography>
              </Grid>
              <Grid item>
                <Box mt={2}>
                  <Button
                    color="primary"
                    size="large"
                    variant="outlined"
                    onClick={() => {
                      router.push("/?panel=import");
                    }}
                  >
                    {t("PanelStart.card.button")}
                  </Button>
                </Box>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
};

ETKPanelStartGeneralInfo.defaultProps = defaultProps;

export default ETKPanelStartGeneralInfo;
