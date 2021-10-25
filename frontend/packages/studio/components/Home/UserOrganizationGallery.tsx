import { useAppContext } from "@/providers/AppContext";
import { Grid, makeStyles } from "@material-ui/core";
import ShowcaseCard from "@/components/Core/Card/ShowcaseCard";

export interface IUserOrganizationGalleryProps {
  variant?: "standalone" | "insideGrid";
}

const useStyles = makeStyles(() => ({
  root: {},
}));

const UserOrganizationGallery: React.FC<IUserOrganizationGalleryProps> = ({
  variant = "standalone",
}) => {
  const classes = useStyles();
  const { user } = useAppContext();

  if (variant == "standalone" && user.organizations) {
    return (
      <Grid container spacing={2}>
        {user.organizations
          .filter((o) => !o.archived)
          .map((o) => (
            <Grid key={o.id} item xs={12} sm={6} md={3}>
              <ShowcaseCard
                ownerEmail=""
                slug={o.slug}
                name={o.name}
                isPrivate={o.mode == "private"}
              />
            </Grid>
          ))}
      </Grid>
    );
  }

  if (variant == "insideGrid" && user.organizations) {
    return (
      <>
        {user.organizations
          .filter((o) => !o.archived)
          .map((o) => (
            <Grid key={o.id} item xs={12} sm={6} md={3}>
              <ShowcaseCard
                ownerEmail=""
                slug={o.slug}
                name={o.name}
                isPrivate={o.mode == "private"}
              />
            </Grid>
          ))}
      </>
    );
  }

  if (!user.organizations) {
    return null;
  }
};

export default UserOrganizationGallery;
