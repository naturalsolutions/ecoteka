import { NextPage } from "next";
import Head from "next/head";
import AppLayoutGeneral from "@/components/AppLayout/General";
import { useTranslation } from "react-i18next";
import { makeStyles, CardMedia, Container } from "@material-ui/core";
import HomeHero from "@/components/Home/Hero";
import FeaturedOrganizations from "@/components/Home/FeaturedOrganizations";
import SectionContainer from "@/components/Core/Section/Container";
import SectionItem from "@/components/Core/Section/Item";
import { useRouter } from "next/router";
import { useAppContext } from "@/providers/AppContext";

const useStyles = makeStyles((theme) => ({
  demos: {
    marginTop: 30,
    [theme.breakpoints.up("md")]: {
      marginTop: 80,
    },
  },
}));

const HomePage: NextPage = () => {
  const classes = useStyles();
  const { t } = useTranslation(["common", "components"]);
  const router = useRouter();
  const { user } = useAppContext();

  return (
    <AppLayoutGeneral>
      <Head>
        <title>ecoTeka · Home</title>
      </Head>
      {user && (
        <div className={classes.demos}>
          <Container>
            <SectionContainer title={t("common.myOrganizations")}>
              {user.organizations.map((organization) => (
                <SectionItem
                  key={organization.name}
                  title={organization.name}
                  subtitle={`${Number(organization.total_trees).toLocaleString(
                    router.locale
                  )} ${t("common.trees")}`}
                  href={`/${organization.slug}`}
                >
                  <CardMedia
                    component="img"
                    image={
                      organization.osm_id
                        ? `/osm_thumbnails/thumbnail/${
                            organization.osm_id
                          }?organizationId=${organization.id}&template=${
                            organization.total_trees > 50000 ? "osm" : "ecoteka"
                          }&width=345&height=183`
                        : "https://via.placeholder.com/345x183.png?text=..."
                    }
                    title={organization.name}
                  />
                </SectionItem>
              ))}
            </SectionContainer>
          </Container>
        </div>
      )}

      <HomeHero />

      <FeaturedOrganizations />
    </AppLayoutGeneral>
  );
};

export default HomePage;
