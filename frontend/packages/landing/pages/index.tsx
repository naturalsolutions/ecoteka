import React from "react";
import { NextPage } from "next";
import { useTranslation } from "react-i18next";
// import { EcotekaTheme } from "@/theme/config";
import { makeStyles, Box, Container, Grid } from "@material-ui/core";
import Head from "next/head";
import Hero from "@/components/Hero/Index";
import KeysContainer from "@/components/Keys/Container";
import KeysImage from "@/components/Keys/Image";
import KeysTexts from "@/components/Keys/Texts";
import KeysTitle from "@/components/Keys/Title";
import KeysDescription from "@/components/Keys/Description";
import Reference from "@/components/Reference";
import SectionContainer from "@/components/Section/Container";
// import Discover from "@/components/Discover";

interface Key {
  src: string;
  alt: string;
  title: string;
  description: string;
  reverse: boolean;
}

interface Reference {
  avatar: string;
  title: string;
  content: string;
}

interface HomePageProps {
  studioUrl: string;
}

const useStyles = makeStyles(() => ({
  root: {
    flexWrap: "unset",
  },
  back: {
    backgroundImage: 'url("references/background.png")',
    backgroundSize: "cover",
  },
  section: {
    justifyContent: "center",
  },
}));

const HomePage: NextPage<HomePageProps> = ({ studioUrl }) => {
  const classes = useStyles();
  const { t } = useTranslation();
  const keys = t("homePage.keys", { returnObjects: true }) as Key[];
  const reference = t("homePage.reference", {
    returnObjects: true,
  }) as Reference;

  return (
    <Grid
      container
      direction="column"
      justifyContent="flex-start"
      className={classes.root}
    >
      <Head>
        <title>ecoTeka · Home</title>
      </Head>
      <Grid item>
        <Hero studioUrl={studioUrl} />
      </Grid>
      <Box my={6} />
      <Grid item>
        <Container>
          <SectionContainer title={t("features")}>
            <Container style={{ maxWidth: 820 }}>
              {keys.map((key) => (
                <KeysContainer key={key.title} reverse={key.reverse}>
                  <KeysImage src={key.src} alt={key.alt} />
                  <KeysTexts>
                    <KeysTitle>{key.title}</KeysTitle>
                    <KeysDescription>{key.description}</KeysDescription>
                  </KeysTexts>
                </KeysContainer>
              ))}
            </Container>
          </SectionContainer>
        </Container>
      </Grid>
      <Grid item className={classes.back}>
        <Container>
          <SectionContainer title={t("team")}>
            <Reference
              src={reference.avatar}
              title={reference.title}
              content={reference.content}
            />
          </SectionContainer>
        </Container>
      </Grid>
      {/*<Grid item className={classes.back}>
        <Container>
          <SectionContainer title={""}>
            <Discover title={t("homePage.discover.title")} />
          </SectionContainer>
        </Container>
        </Grid>*/}
    </Grid>
  );
};

HomePage.getInitialProps = async () => {
  return {
    studioUrl: process.env.STUDIO_URL,
  };
};

export default HomePage;
