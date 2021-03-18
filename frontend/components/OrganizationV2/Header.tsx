// @ts-nocheck
import cx from "clsx";
import { makeStyles } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import CardMedia from "@material-ui/core/CardMedia";
import CardContent from "@material-ui/core/CardContent";
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
import TextInfoContent from "@/components/Core/Content/TextInfo";
import { useTextInfoContentStyles } from "@/styles/TextInfo";
import { useFloatShadowStyles } from "@/styles/Shadow/float";
import { useGraphicBtnStyles } from "@/styles/Button/graphic";
import { useAppContext } from "@/providers/AppContext";
import router from "next/router";

const useStyles = makeStyles(({ breakpoints, spacing }) => ({
  root: {
    margin: "auto",
    width: "100%",
    borderRadius: spacing(2), // 16px
    transition: "0.3s",
    boxShadow: "0px 14px 80px rgba(34, 35, 58, 0.2)",
    position: "relative",
    marginLeft: "auto",
    overflow: "initial",
    background: "#ffffff",
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
  },
  cta: {
    marginTop: 24,
    textTransform: "initial",
  },
}));

const OrganizationHeader: React.FC = (props) => {
  const styles = useStyles();
  const { organization } = useAppContext();
  const { button: buttonStyles, ...contentStyles } = useTextInfoContentStyles();
  const shadowStyles = useFloatShadowStyles();
  const graphicStyles = useGraphicBtnStyles();
  return (
    <Card className={cx(styles.root, shadowStyles.root)}>
      <CardMedia className={styles.media} image={""} />
      <CardContent>
        <TextInfoContent
          classes={contentStyles}
          overline={"Ajouté le 14 mars 2021"}
          heading={"Titre de l'organisation"}
          body={
            "Ce serait bien de laisser la possibilté d'ajouter un texte de présentation pour les organizations, en particulier pour les organisation oouvertes ou participatives."
          }
        />
        <Grid
          container
          spacing={2}
          direction="row"
          justify="space-between"
          alignItems="center"
        >
          <Grid item xs={12} md={6}>
            <Button
              className={buttonStyles}
              onClick={() => {
                router.push({
                  pathname: "/[organizationSlug]/map",
                  query: {
                    organizationSlug: organization.slug,
                  },
                });
              }}
            >
              ÉDITEUR CARTOGRAPHIQUE
            </Button>
          </Grid>
          <Grid item xs={12} md={6}>
            <Button
              classes={graphicStyles}
              variant={"contained"}
              color={"primary"}
              disableRipple
            >
              TABLEAU DE BORD
            </Button>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};

export default OrganizationHeader;
