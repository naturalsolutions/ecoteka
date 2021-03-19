import { Grid } from "@material-ui/core";
import DatasetCard from "@/components/Core/Card/DatasetCard";

const featuredDatasetsDemoData = [
  {
    id: 1,
    imgUrl: "https://source.unsplash.com/L0g-RMvxJZs/500x500",
    heading: "Paris",
    body:
      "Découvrez les données publiques du patrimoine arboré de la plus belle ville du monde après Marseille.",
    avatarUrl:
      "https://gitlab.com/uploads/-/system/project/avatar/19519827/Ecoteka_short_logo_light.png",
    path: "paris",
  },
  {
    id: 2,
    imgUrl: "https://source.unsplash.com/WPfKROQzI48/500x500",
    heading: "New York City",
    body:
      "The Big Apple! Serez-vous capable de retrouver tous les pommiers dans cet inventaire participatif de 2015?",
    avatarUrl:
      "https://gitlab.com/uploads/-/system/project/avatar/19519827/Ecoteka_short_logo_light.png",
    path: "nyc",
  },
  {
    id: 1,
    imgUrl: "https://source.unsplash.com/RhR8dOmvY_Q/500x500",
    heading: "Singapour",
    body:
      "Un patrimoine arboré d'extrême diversité avec plus de 600 000 arbres. Filtrer la carte pour retrouver les durians!",
    avatarUrl:
      "https://gitlab.com/uploads/-/system/project/avatar/19519827/Ecoteka_short_logo_light.png",
    path: "singapour",
  },
];

const DatasetsGallery: React.FC = (props) => {
  return (
    <Grid container spacing={2}>
      {featuredDatasetsDemoData.map((dataset, index) => (
        <Grid key={index} item xs={12} md={4} lg={3}>
          <DatasetCard {...dataset} />
        </Grid>
      ))}
    </Grid>
  );
};

export default DatasetsGallery;
