import { FC, useEffect } from "react";
import {
  makeStyles,
  Container,
  Grid,
  Link,
  Box,
  Typography,
  List,
  ListItem,
} from "@material-ui/core";
import { EcotekaTheme } from "@/theme/config";
import { HubButton } from "@ecoteka/core";
import { useTranslation } from "react-i18next";
import { useRouter } from "next/router";
import { useState } from "react";
import LinkedInIcon from "@material-ui/icons/LinkedIn";

export type FooterTitleColumn = "ns" | "ecoteka" | "newsletter";
export type FooterLinks =
  | "community"
  | "gitlab"
  | "avion"
  | "ns"
  | "team"
  | "legacy"
  | "linkedin";

export interface FooterLink {
  href: string;
  title: string;
}

const useStyles = makeStyles((theme: EcotekaTheme) => ({
  root: {
    backgroundColor: theme.palette.background.dark,
    padding: "0px 0px 30px 0px",
  },
  text: {
    color: theme.palette.getContrastText(theme.palette.background.dark),
  },
  link: {
    color: theme.palette.getContrastText(theme.palette.background.dark),
    display: "flex",
    alignItems: "center",
  },
}));

const MainFooterLinks: FC = () => {
  const classes = useStyles();
  const { t } = useTranslation();
  const titles: Record<FooterTitleColumn, string> = t(
    "LayoutFooter.titleColumn",
    {
      returnObjects: true,
    }
  );
  const links: Record<FooterLinks, FooterLink> = t("LayoutFooter.links", {
    returnObjects: true,
  });

  return (
    <Grid container spacing={6}>
      <Grid item xs={12} md={4}>
        <List>
          <ListItem>
            <Typography
              component="h3"
              variant="subtitle2"
              className={classes.text}
            >
              {titles.ecoteka}
            </Typography>
          </ListItem>
          <ListItem>
            <Link href={links.community.href} className={classes.text}>
              {links.community.title}
            </Link>
          </ListItem>
          <ListItem>
            <Link href={links.gitlab.href} className={classes.text}>
              {links.gitlab.title}
            </Link>
          </ListItem>
          <ListItem>
            <Link href={links.avion.href} className={classes.text}>
              {links.avion.title}
            </Link>
          </ListItem>
        </List>
      </Grid>
      <Grid item xs={12} md={4}>
        <List>
          <ListItem>
            <Typography
              component="h3"
              variant="subtitle2"
              className={classes.text}
            >
              {titles.ns}
            </Typography>
          </ListItem>
          <ListItem>
            <Link href={links.ns.href} className={classes.text}>
              {links.ns.title}
            </Link>
          </ListItem>
          <ListItem>
            <Link href={links.team.href} className={classes.text}>
              {links.team.title}
            </Link>
          </ListItem>
        </List>
      </Grid>
      <Grid item xs={12} md={4}>
        <List>
          <ListItem>
            <Typography
              component="h3"
              variant="subtitle2"
              className={classes.text}
            >
              {titles.newsletter}
            </Typography>
          </ListItem>
          <ListItem>
            <HubButton
              message={t("LayoutFooter.newsletterMessage")}
              variant="outlined"
              buttonClassName={classes.text}
              formId="acf66b7b-3f02-41ac-8efa-005757f27d86"
              color="primary"
            />
          </ListItem>
        </List>
      </Grid>
      <Grid container item xs={12} justifyContent="center">
        <Link href={links.legacy.href} className={classes.text}>
          <Box pr={10}>{links.legacy.title}</Box>
        </Link>
        <Link href={links.linkedin.href} className={classes.link}>
          <LinkedInIcon />
          <Box pl={1}>{links.linkedin.title}</Box>
        </Link>
      </Grid>
    </Grid>
  );
};

const IntLinks: FC = () => {
  const classes = useStyles();
  const { t } = useTranslation();
  const titles: Record<FooterTitleColumn, string> = t(
    "LayoutFooter.titleColumn",
    {
      returnObjects: true,
    }
  );

  return (
    <Grid container spacing={6}>
      <Grid item xs={12} md={4}>
        <List>
          <ListItem>
            <Typography
              component="h3"
              variant="subtitle2"
              className={classes.text}
            >
              {titles.newsletter}
            </Typography>
          </ListItem>
          <ListItem>
            <HubButton
              message={t("LayoutFooter.newsletterMessage")}
              variant="outlined"
              formId="acf66b7b-3f02-41ac-8efa-005757f27d86"
              buttonClassName={classes.text}
              color="primary"
            />
          </ListItem>
        </List>
      </Grid>
    </Grid>
  );
};

const LayoutFooter: FC = () => {
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

export default LayoutFooter;
