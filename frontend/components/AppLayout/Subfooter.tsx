import { FC, useEffect, useState } from "react";
import {
  makeStyles,
  Container,
  Grid,
  Typography,
  List,
  ListItem,
} from "@material-ui/core";
import { EcotekaTheme } from "@/theme/config";
import { useTranslation } from "react-i18next";
import { useRouter } from "next/router";
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

const MainFooterLinks: FC = () => {
  const classes = useStyles();
  const { t } = useTranslation();

  return (
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
            {" "}
            {t("LayoutFooter.caption")}
          </Typography>
        </Grid>
        <Grid item>
          <HubButton
            buttonClassName={classes.text}
            formId="8d88fc04-0c59-4544-8229-0e3063005320"
            message={t("LayoutFooter.contact")}
            variant="contained"
            color="secondary"
          />
        </Grid>
      </Grid>
    </Grid>
  );
};

const IntLinks: FC = () => {
  const classes = useStyles();
  const { t } = useTranslation();
  const titles: Record<FooterTitleColumn, string> = t(
    "LayoutSubFooter.titleColumn",
    {
      returnObjects: true,
    }
  );

  return (
    <Grid container spacing={6}>
      <Grid item xs={12} md={4}>
        <List>
          <ListItem>
            <Typography variant="subtitle2" className={classes.text}>
              {titles.newsletter}
            </Typography>
          </ListItem>
          <ListItem>
            <HubButton
              buttonClassName={classes.text}
              formId="8d88fc04-0c59-4544-8229-0e3063005320"
              message={t("LayoutSubFooter.newsletterMessage")}
              variant="outlined"
              color="primary"
            />
          </ListItem>
        </List>
      </Grid>
    </Grid>
  );
};

const LayoutSubFooter: FC = () => {
  const classes = useStyles();
  const [locale, setLocale] = useState<string>("fr");
  const router = useRouter();

  useEffect(() => {
    if (router.locale) {
      setLocale(router.locale);
    }
  }, [router]);

  const LOCALIZED_LINKS = {
    fr: <MainFooterLinks />,
    en: <IntLinks />,
    es: <IntLinks />,
  };

  return (
    <div className={classes.root}>
      <Container>{LOCALIZED_LINKS[locale]}</Container>
    </div>
  );
};

export default LayoutSubFooter;
