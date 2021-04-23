// @ts-nocheck
import cx from "clsx";
import { makeStyles } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import Box from "@material-ui/core/Box";
import CardContent from "@material-ui/core/CardContent";
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
import ShareIcon from "@material-ui/icons/Share";
import VpnLockIcon from "@material-ui/icons/VpnLock";
import PublicIcon from "@material-ui/icons/Public";
import TreeIcon from "@material-ui/icons/Nature";
import SupervisedUserCircleIcon from "@material-ui/icons/SupervisedUserCircle";
import TextInfoContent from "@/components/Core/Content/TextInfo";
import { formatDistance } from "date-fns";
import { fr } from "date-fns/locale";
import { useTranslation } from "react-i18next";
import { useTextInfoContentStyles } from "@/styles/TextInfo";
import { useFloatShadowStyles } from "@/styles/Shadow/float";
import { useGraphicBtnStyles } from "@/styles/Button/graphic";
import { useAppContext } from "@/providers/AppContext";
import router from "next/router";
import Can from "@/components/Can";
import MapProvider from "@/components/Map/Provider";
import OSMLayer from "@/components/Map/Layers/OSM";

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
  map: {
    [breakpoints.up("md")]: {
      width: "50%",
      marginLeft: "-20px",
    },
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

const OrganizationHeader: React.FC = (props) => {
  const styles = useStyles();
  const { button: buttonStyles, ...contentStyles } = useTextInfoContentStyles();
  const shadowStyles = useFloatShadowStyles();
  const graphicStyles = useGraphicBtnStyles();
  const osmLayer = OSMLayer(true);
  const { organization, user } = useAppContext();
  const { t } = useTranslation(["common", "components"]);

  return (
    organization && (
      <Card className={cx(styles.root, shadowStyles.root)}>
        <Box className={styles.map}>
          <MapProvider layers={[osmLayer]} borderRadius={10} height={300} />
        </Box>
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
            body={``}
          />
          <Grid
            container
            spacing={2}
            direction="row"
            alignItems="center"
            className={styles.cta}
          >
            <Grid
              item
              xs={6}
              md={3}
              container
              spacing={2}
              direction="row"
              alignItems="center"
            >
              <TreeIcon color="primary" />
              <Box>
                {organization.total_trees} {t("common.trees")}
              </Box>
            </Grid>
            <Grid
              item
              xs={6}
              md={3}
              container
              spacing={2}
              direction="row"
              alignItems="center"
            >
              <SupervisedUserCircleIcon color="primary" />
              <Box>
                {organization.total_members} {t("common.members")}
              </Box>
            </Grid>
          </Grid>
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
                <Grid item xs={12} md={6}>
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
    )
  );
};

export default OrganizationHeader;
