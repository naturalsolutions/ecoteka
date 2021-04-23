import { NextPage } from "next";
import AppLayoutGeneral from "@/components/AppLayout/General";
import { useTranslation } from "react-i18next";
import { makeStyles, CardMedia, Container } from "@material-ui/core";
import HomeHero from "@/components/Home/Hero";
import SectionContainer from "@/components/Core/Section/Container";
import SectionItem from "@/components/Core/Section/Item";
import { useRouter } from "next/router";

const useStyles = makeStyles((theme) => ({
  demos: {
    marginTop: 30,
    [theme.breakpoints.up("md")]: {
      marginTop: 80,
    },
  },
}));

const demos = [
  { title: "Paris", trees: 205034, slug: "paris", osm_id: "7444" },
  {
    title: "Londres",
    trees: 880021,
    slug: "london",
    osm_id: "65606",
  },
  {
    title: "New York",
    trees: 592130,
    slug: "new_york",
    osm_id: "175905",
  },
];

const HomePage: NextPage = () => {
  const classes = useStyles();
  const { t } = useTranslation(["common", "components"]);
  const router = useRouter();

  return (
    <AppLayoutGeneral>
      <HomeHero />

      <div className={classes.demos}>
        <Container>
          <SectionContainer title={t("common.demos")}>
            {demos.map((demo) => (
              <SectionItem
                key={demo.title}
                title={demo.title}
                subtitle={`${Number(demo.trees).toLocaleString(
                  router.locale
                )} ${t("common.trees")}`}
                href={`/${demo.slug}`}
              >
                <CardMedia
                  component="img"
                  image={`/osm_thumbnails/thumbnail/${demo.osm_id}?width=345&height=183&padding=30`}
                  title={demo.title}
                />
              </SectionItem>
            ))}
          </SectionContainer>
        </Container>
      </div>
    </AppLayoutGeneral>
  );
};

export default HomePage;
