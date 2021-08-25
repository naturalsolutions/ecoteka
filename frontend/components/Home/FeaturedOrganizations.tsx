import { FC, useEffect, useState } from "react";
import { Container, CardMedia, makeStyles, Theme } from "@material-ui/core";
import SectionContainer from "@/components/Core/Section/Container";
import SectionItem from "@/components/Core/Section/Item";
import WorkInProgress from "@/components/WorkInProgress";
import useApi from "@/lib/useApi";
import { useRouter } from "next/router";
import { useTranslation } from "react-i18next";

export interface FeaturedOrganizationsProps {}

const useStyles = makeStyles((theme: Theme) => ({
  root: {},
  demos: {
    marginTop: 30,
    [theme.breakpoints.up("md")]: {
      marginTop: 80,
    },
  },
}));

const FeaturedOrganizations: FC<FeaturedOrganizationsProps> = ({}) => {
  const classes = useStyles();
  const router = useRouter();
  const { apiETK } = useApi().api;
  const { t } = useTranslation(["common", "components"]);
  const [featuredOrganizations, setFeaturedOrganizations] = useState(undefined);

  const fetchFeaturedOrganization = async () => {
    try {
      const { data, status } = await apiETK.get("/featured/organizations");
      if (status == 200) {
        setFeaturedOrganizations(data);
      }
    } catch (e) {}
  };

  useEffect(() => {
    fetchFeaturedOrganization();
  }, []);

  return (
    <div className={classes.demos}>
      <Container>
        <SectionContainer title={t("common.demos")}>
          {featuredOrganizations && featuredOrganizations.length > 0 ? (
            featuredOrganizations.map((organization) => (
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
                  image={`/osm_thumbnails/thumbnail/${
                    organization.osm_id
                  }?organizationId=${organization.id}&template=${
                    organization.total_trees > 50000 ? "osm" : "ecoteka"
                  }&width=345&height=183`}
                  title={organization.name}
                />
              </SectionItem>
            ))
          ) : (
            <WorkInProgress
              title={t("components.Home.FeaturedOrganizations.noOrganization")}
            />
          )}
        </SectionContainer>
      </Container>
    </div>
  );
};

export default FeaturedOrganizations;
