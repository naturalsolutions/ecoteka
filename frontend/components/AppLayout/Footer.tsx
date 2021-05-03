import { FC } from "react";
import {
  makeStyles,
  Container,
  Grid,
  Link,
  Typography,
} from "@material-ui/core";
import { List } from "@material-ui/core";
import { ListItem } from "@material-ui/core";
import { EcotekaTheme } from "@/theme/config";
import NewsletterButton from "@/components/NewsletterButton";
import { useTranslation } from "react-i18next";

const useStyles = makeStyles((theme: EcotekaTheme) => ({
  root: {
    backgroundColor: theme.palette.background.dark,
    padding: "60px 0",
  },
  text: {
    color: theme.palette.getContrastText(theme.palette.background.dark),
  },
}));

export type FooterTitleColumn = "ns" | "ecoteka" | "newsletter";
export type FooterLinks = "community" | "gitlab" | "avion" | "ns" | "team";

export interface FooterLink {
  href: string;
  title: string;
}

const LayoutFooter: FC = () => {
  const classes = useStyles();
  const { t } = useTranslation();
  const titles: Record<FooterTitleColumn, string> = t(
    "components.LayoutFooter.titleColumn",
    {
      returnObjects: true,
    }
  );
  const links: Record<FooterLinks, FooterLink> = t(
    "components.LayoutFooter.links",
    {
      returnObjects: true,
    }
  );

  return (
    <div className={classes.root}>
      <Container>
        <Grid container spacing={6}>
          <Grid item xs={12} md={4}>
            <List>
              <ListItem>
                <Typography variant="subtitle2" className={classes.text}>
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
                <Typography variant="subtitle2" className={classes.text}>
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
                <Typography variant="subtitle2" className={classes.text}>
                  {titles.newsletter}
                </Typography>
              </ListItem>
              <ListItem>
                <NewsletterButton />
              </ListItem>
            </List>
          </Grid>
        </Grid>
      </Container>
    </div>
  );
};

export default LayoutFooter;
