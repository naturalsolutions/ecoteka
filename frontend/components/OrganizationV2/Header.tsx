// @ts-nocheck
import { useState, useEffect } from "react";
import cx from "clsx";
import { makeStyles } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import Typography from "@material-ui/core/Typography";
import CardContent from "@material-ui/core/CardContent";
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
import ShareIcon from "@material-ui/icons/Share";
import VpnLockIcon from "@material-ui/icons/VpnLock";
import PublicIcon from "@material-ui/icons/Public";
import TextInfoContent from "@/components/Core/Content/TextInfo";
import { formatDistance } from "date-fns";
import { fr } from "date-fns/locale";
import { StaticMap } from "react-map-gl";
import DeckGL from "@deck.gl/react";
import { useThemeContext } from "@/lib/hooks/useThemeSwitcher";
import useApi from "@/lib/useApi";
import useLocalStorage from "@/lib/hooks/useLocalStorage";
import { useTranslation } from "react-i18next";
import { useTextInfoContentStyles } from "@/styles/TextInfo";
import { useFloatShadowStyles } from "@/styles/Shadow/float";
import { useGraphicBtnStyles } from "@/styles/Button/graphic";
import { useAppContext } from "@/providers/AppContext";
import router from "next/router";
import FullPageSpinner from "@/components/Core/Feedback/FullPageSpinner";
import Can from "@/components/Can";
import getConfig from "next/config";
import { MVTLayer } from "@deck.gl/geo-layers";
import { FlyToInterpolator } from "@deck.gl/core";
import SvgIcon, { SvgIconProps } from "@material-ui/core/SvgIcon";
import TreePath from "@/public/assets/icons/tree_detailled.svg";
import { IOrganization } from "@/index";

const useStyles = makeStyles(({ breakpoints, spacing, palette }) => ({
  root: {
    margin: "auto",
    width: "100%",
    borderRadius: spacing(2), // 16px
    transition: "0.3s",
    boxShadow: "0px 14px 80px rgba(34, 35, 58, 0.2)",
    position: "relative",
    marginLeft: "auto",
    overflow: "initial",
    background: palette.background.default,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    paddingBottom: spacing(2),
    [breakpoints.up("md")]: {
      flexDirection: "row",
      paddingTop: spacing(2),
    },
  },
  media: {
    width: "88%",
    marginLeft: "auto",
    marginRight: "auto",
    marginTop: spacing(-3),
    height: 0,
    paddingBottom: "48%",
    borderRadius: spacing(2),
    backgroundColor: "#fff",
    position: "relative",
    [breakpoints.up("md")]: {
      width: "100%",
      height: "100%",
      minHeight: "400px",
      paddingBottom: "12%",
      marginLeft: spacing(-3),
      marginTop: 0,
      transform: "translateX(-8px)",
    },
    "&:after": {
      content: '" "',
      position: "absolute",
      top: 0,
      left: 0,
      width: "100%",
      height: "100%",
      backgroundImage: "linear-gradient(147deg, #1d675b 0%, #1d675b 54%)",
      borderRadius: spacing(2), // 16
      opacity: 0.5,
    },
  },
  content: {
    padding: 24,
    width: "100%",
    [breakpoints.up("md")]: {
      width: "50%",
    },
  },
  cta: {
    marginTop: 24,
    textTransform: "initial",
  },
  treeCount: {
    color: palette.primary.dark,
  },
}));

const useCardMapStyles = makeStyles(({ breakpoints, spacing }) => ({
  root: {
    width: "100%",
    height: "300px",
    position: "relative",
    borderRadius: "10px",
    overflow: "hidden",
    [breakpoints.up("md")]: {
      width: "50%",
      marginLeft: "-20px",
    },
  },
}));

const TreeIcon = (props: SvgIconProps) => {
  return (
    <SvgIcon {...props}>
      <TreePath />
    </SvgIcon>
  );
};

const OrganizationMode: React.FC = ({ mode }) => {
  const { t } = useTranslation(["common", "components"]);
  let icon;
  switch (mode) {
    case "open":
      icon = <PublicIcon color="action" />;
      break;
    case "private":
      icon = <VpnLockIcon color="action" />;
      break;
    case "participatory":
      icon = <VpnLockIcon color="action" />;
      break;
    default:
      icon = <VpnLockIcon color="action" />;
  }
  return (
    <Grid
      container
      spacing={1}
      direction="row"
      justify="space-between"
      alignItems="center"
    >
      <Grid item>{icon}</Grid>
      <Grid item>{t(`common.${mode}`)}</Grid>
    </Grid>
  );
};

const CardMap: React.FC = ({ children }) => {
  const styles = useCardMapStyles();
  return <div className={styles.root}>{children}</div>;
};

export interface OrganizationHeader {
  organization?: IOrganization;
  isOrganizationLoading?: boolean;
}

const OrganizationHeader: React.FC<OrganizationHeader> = ({
  organization,
  isOrganizationLoading,
}) => {
  const { publicRuntimeConfig } = getConfig();
  const { apiUrl } = publicRuntimeConfig;
  const styles = useStyles();
  const { button: buttonStyles, ...contentStyles } = useTextInfoContentStyles();
  const shadowStyles = useFloatShadowStyles();
  const graphicStyles = useGraphicBtnStyles();
  const { user } = useAppContext();
  const { apiETK } = useApi().api;
  const { t } = useTranslation(["common", "components"]);
  const { dark } = useThemeContext();
  const [time, setTime] = useState(Date.now());
  const [mapBackground, setMapbackground] = useLocalStorage(
    "etk:map:mapBackground",
    "map"
  );
  const [token] = useLocalStorage("ecoteka_access_token");
  const [scope, setScope] = useState("public");

  const [initialViewState, setInitialViewState] = useLocalStorage(
    "etk:map:viewstate",
    defaultViewState
  );
  const [viewState, setViewState] = useState();

  const defaultViewState = {
    longitude: 2.54,
    latitude: 46.7,
    zoom: 4,
  };
  const fitToBounds = async (organizationId: number) => {
    if (!organizationId) {
      return;
    }
    try {
      const { status, data: bbox } = await apiETK.get(`/maps/bbox`, {
        params: {
          organization_id: organizationId,
        },
      });

      if (status === 200) {
        const newViewState = treesLayer.context.viewport.fitBounds([
          [bbox.xmin, bbox.ymin],
          [bbox.xmax, bbox.ymax],
        ]);

        setInitialViewState({
          longitude: newViewState.longitude,
          latitude: newViewState.latitude,
          zoom: newViewState.zoom,
        });

        setViewState({
          ...newViewState,
          transitionDuration: 1000,
          transitionInterpolator: new FlyToInterpolator(),
        });
      }
    } catch (e) {}
  };

  const treesLayer = new MVTLayer({
    id: "trees",
    data: `${apiUrl.replace("/api/v1", "")}/tiles/${
      organization?.id
    }/{z}/{x}/{y}.pbf?scope=${scope}&dt=${time}`,
    minZoom: 0,
    maxZoom: 12,
    getLineColor: [68, 132, 134, 128],
    getFillColor: [68, 132, 134, 128],
    lineWidthMinPixels: 1,
    pointRadiusMinPixels: 1,
    pointRadiusMaxPixels: 1,
    pointRadiusScale: 2,
    minRadius: 10,
    radiusMinPixels: 0.5,
    uniqueIdProperty: "id",
  });

  const formattedTimestamps = (dateTime) => {
    try {
      return `${t("common.Organization")} ${t(
        "components.organization.updated"
      )} ${formatDistance(new Date(organization.updated_at), new Date(), {
        addSuffix: true,
        locale: fr,
      })}`;
    } catch (e) {
      return "...";
    }
  };

  useEffect(() => {
    console.log(organization);
    setViewState({ ...initialViewState });
  }, []);

  useEffect(() => {
    setTime(Date.now());
    if (organization) {
      fitToBounds(organization.id);
      if (organization?.mode == "private") {
        setScope(`private&token=${token}`);
      }
    }
  }, [organization]);

  if (organization) {
    return (
      <Card className={cx(styles.root, shadowStyles.root)}>
        <CardMap>
          <DeckGL
            viewState={viewState}
            controller={true}
            layers={[treesLayer]}
            onViewStateChange={(e) => {
              setInitialViewState({
                longitude: e.viewState.longitude,
                latitude: e.viewState.latitude,
                zoom: e.viewState.zoom,
              });
              setViewState(e.viewState);
            }}
          >
            <StaticMap
              mapStyle={`/api/v1/maps/style/?theme=${
                dark ? "dark" : "light"
              }&background=${mapBackground}`}
            ></StaticMap>
          </DeckGL>
        </CardMap>
        <CardContent className={styles.content}>
          <Grid
            container
            spacing={2}
            direction="row"
            justify="flex-end"
            alignItems="center"
          >
            <Grid item>
              <ShareIcon color="action" />
            </Grid>
          </Grid>
          <TextInfoContent
            classes={contentStyles}
            overline={<OrganizationMode mode={organization.mode} />}
            heading={organization.name}
            body={formattedTimestamps(organization.updated_at)}
          />
          <Grid
            container
            spacing={2}
            direction="row"
            justify="flex-end"
            alignItems="center"
          >
            <Can do="read" on="Trees">
              <Grid
                item
                container
                spacing={2}
                direction="row"
                justify="flex-end"
                alignItems="center"
                xs={12}
                md={8}
              >
                <Grid
                  item
                  xs={6}
                  container
                  spacing={2}
                  direction="row"
                  justify="flex-start"
                  alignItems="flex-end"
                >
                  <TreeIcon color="primary" style={{ fontSize: 36 }} />
                  <Typography variant="h6" className={styles.treeCount}>
                    {organization.total_trees} {t("common.trees")}
                  </Typography>
                </Grid>
                <Grid item>
                  <Button
                    classes={graphicStyles}
                    variant={"contained"}
                    color={"primary"}
                    onClick={() => {
                      router.push({
                        pathname: "/[organizationSlug]/map",
                        query: {
                          organizationSlug: organization.slug,
                        },
                      });
                    }}
                    disableRipple
                  >
                    {t("components.Organization.mapEditor")}
                  </Button>
                </Grid>
              </Grid>
            </Can>
            {!user && (
              <Can not do="read" on="Trees">
                <Grid
                  item
                  xs={6}
                  container
                  spacing={2}
                  direction="row"
                  justify="flex-start"
                  alignItems="flex-end"
                >
                  <TreeIcon color="primary" style={{ fontSize: 36 }} />
                  <Typography variant="h6" className={styles.treeCount}>
                    {organization.total_trees} {t("common.trees")}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Button
                    classes={graphicStyles}
                    variant={"contained"}
                    color={"primary"}
                    onClick={() => {
                      router.push({
                        pathname: "/[organizationSlug]/map",
                        query: {
                          organizationSlug: organization.slug,
                        },
                      });
                    }}
                    disableRipple
                  >
                    {t("components.Organization.mapExplorer")}
                  </Button>
                </Grid>
              </Can>
            )}
          </Grid>
        </CardContent>
      </Card>
    );
  } else {
    return <div>...</div>;
  }
};

export default OrganizationHeader;
