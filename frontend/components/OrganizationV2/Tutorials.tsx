import { makeStyles } from "@material-ui/core/styles";
import { Box, Grid, Typography } from "@material-ui/core";
import VideoCard from "@/components/Core/Card/VideoCard";

const useStyles = makeStyles(({ palette, spacing }) => {
  return {
    root: {
      minHeight: "300px",
    },
    section: {
      marginTop: spacing(3),
      marginBottom: spacing(4),
      color: palette.text.primary,
    },
  };
});

const tutorialsDemoData = [
  {
    id: 1,
    title: "Premier tutoriel",
    videoUrl: "https://www.youtube.com/watch?v=2pkvW3aF024",
    videoCapture: "https://source.unsplash.com/c_o2lRzWI08/500x500",
  },
];

const Tutorials = (props) => {
  const styles = useStyles();
  return (
    <Box className={styles.root} pb={8}>
      <Typography variant="h4" component="h2" className={styles.section}>
        Tutoriels
      </Typography>
      <Grid container>
        {tutorialsDemoData.map((tutorial, index) => (
          <Grid key={index} item xs={12} md={4} lg={3}>
            <VideoCard {...tutorial} />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default Tutorials;
