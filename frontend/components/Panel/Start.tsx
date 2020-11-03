import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import {
  makeStyles,
  Grid,
  Typography,
  Box,
  Card,
  CardContent,
  Button,
} from "@material-ui/core";
import { useTranslation } from "react-i18next";
import CardInfoPanel from "../Card/InfoPanel";
import { apiRest } from "../../lib/api";
import { useAppContext } from "../../providers/AppContext";

export interface ETKPanelStartProps {}

const defaultProps: ETKPanelStartProps = {};

const useStyles = makeStyles(() => ({
  root: {
    maxWidth: "25rem",
    height: "100%",
  },
  card: {
    background: "#b2dfdc",
  },
  cardTitle: {
    fontWeight: "bold",
  },
}));

const fetchData = async function (organizationId: number) {
  try {
    const response = await apiRest.organization.get(organizationId);

    if (response.ok) {
      const organization = await response.json();

      return organization;
    }
  } catch (e) {}
};

interface Organization {
  id: number;
  name: string;
  slug: string;
  total_trees: number;
}

const ETKPanelStart: React.FC<ETKPanelStartProps> = (props) => {
  const router = useRouter();
  const classes = useStyles();
  const { t } = useTranslation("components");
  const { user } = useAppContext();
  const [organization, setOrganization] = useState<Organization>();

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
          content={`11 ${t("PanelStart.numberOfTrees.content")}`}
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
                    color="secondary"
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

ETKPanelStart.defaultProps = defaultProps;

export default ETKPanelStart;
