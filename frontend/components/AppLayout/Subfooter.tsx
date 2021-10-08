import { FC } from "react";
import { makeStyles, Container, Grid, Typography } from "@material-ui/core";
import { EcotekaTheme } from "@/theme/config";
import { useTranslation } from "react-i18next";
import HubButton from "@/components/HubButton";

export type FooterTitleColumn = "ns" | "ecoteka" | "newsletter";
export type FooterLinks =
  | "community"
  | "gitlab"
  | "avion"
  | "ns"
  | "team"
  | "linkedin";

export interface FooterLink {
  href: string;
  title: string;
}

const useStyles = makeStyles((theme: EcotekaTheme) => ({
  root: {
    backgroundColor: theme.palette.background.shade,
    padding: "20px 0px 50px 0px",
  },
  text: {
    color: theme.palette.getContrastText(theme.palette.background.dark),
  },
}));

<<<<<<< HEAD
const LayoutSubFooter: FC = () => {
=======
const MainFooterLinks: FC = () => {
>>>>>>> 6a4099c4b79e6bd17fea6e728aa48124b7cd580a
  const classes = useStyles();
  const { t } = useTranslation();

  return (
    <div className={classes.root}>
      <Container>
        <Grid container>
          <Grid
            container
            item
            xs={12}
            spacing={1}
            justify="center"
            direction="column"
            alignItems="center"
          >
            <Grid item>
              <Typography
                component="div"
                variant="subtitle2"
                className={classes.text}
              >
                {t("components.LayoutFooter.caption")}
              </Typography>
            </Grid>
            <Grid item>
              <HubButton
                buttonClassName={classes.text}
                formId="8d88fc04-0c59-4544-8229-0e3063005320"
                message={t("components.LayoutFooter.contact")}
                variant="contained"
                color="secondary"
              />
            </Grid>
          </Grid>
        </Grid>
      </Container>
    </div>
  );
};

export default LayoutSubFooter;
