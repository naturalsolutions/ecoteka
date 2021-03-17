import { makeStyles } from "@material-ui/core/styles";
import OrgChart from "@mui-treasury/components/chart/org";
import Box from "@material-ui/core/Box";
import Avatar from "@material-ui/core/Avatar";
import Typography from "@material-ui/core/Typography";
import { Column, Row, Item } from "@/components/Core/Flex";
import Link from "@material-ui/core/Link";

const useStyles = makeStyles(() => ({
  avatar: {
    width: 64,
    height: 64,
  },
  name: {
    fontWeight: "bold",
    fontSize: 14,
    whiteSpace: "nowrap",
    marginTop: 4,
  },
  position: {
    verticalAlign: "super",
  },
  card: {
    width: "100%",
    borderRadius: 16,
    boxShadow: "0 8px 16px 0 #BDC9D7",
    overflow: "hidden",
  },
  header: {
    fontFamily: "Inter, sans-serif",
    backgroundColor: "#fff",
  },
  headline: {
    color: "#122740",
    fontSize: "1.25rem",
    fontWeight: 600,
  },
  link: {
    color: "#2281bb",
    padding: "0 0.25rem",
    fontSize: "0.875rem",
  },
  actions: {
    color: "#BDC9D7",
  },
  divider: {
    backgroundColor: "#d9e2ee",
    margin: "0 20px",
  },
}));

const OrgHierarchyChart: React.FC = (props) => {
  const styles = useStyles();
  return (
    <Column p={0} my={2} gap={0} grow className={styles.card}>
      <Row wrap p={2} alignItems={"baseline"} className={styles.header}>
        <Item stretched className={styles.headline}>
          Secteurs et stations associés(N)
        </Item>
        <Item className={styles.actions}>
          <Link className={styles.link}>En savoir plus</Link> •{" "}
          <Link className={styles.link}>Gérer les secteurs</Link>
        </Item>
      </Row>
      <Item p={3}>
        <OrgChart
          spacingX={24}
          treeData={getData()}
          renderContent={({ src, name, mode, slug }) => (
            <Box justifyContent="center" display="contents">
              <Avatar
                className={styles.avatar}
                src={src}
                onClick={() => console.log(name)}
              />
              <Typography className={styles.name} variant={"h6"}>
                {name}
              </Typography>
              <Typography
                className={styles.position}
                color={"textSecondary"}
                variant={"caption"}
              >
                {mode}
              </Typography>
            </Box>
          )}
        />
      </Item>
    </Column>
  );
};

const getData = () => ({
  name: "Ecoteka",
  mode: "Privé",
  slug: "ecoteka",
  src: "https://source.unsplash.com/300x300/?nature,tree,city",
  children: [
    {
      name: "Marseille",
      mode: "Privé",
      slug: "ecoteka-marseille",
      src: "https://source.unsplash.com/300x300/?forest",
      children: [
        {
          name: "Quartier Noailles",
          slug: "ecoteka-quartier-noaille",
          mode: "Participatif",
          src: "https://source.unsplash.com/300x300/?canopy",
        },
        {
          name: "1er Arrondissement",
          slug: "ecoteka-1er-arrondissement",
          mode: "Public",
          src: "https://source.unsplash.com/300x300/?shrub",
        },
      ],
    },
    {
      name: "Nantes",
      slug: "ecoteka-nantes",
      mode: "Public",
      src: "https://source.unsplash.com/300x300/?nature",
    },
    {
      name: "Toulon",
      slug: "ecoteka-toulon",
      mode: "Privé",
      src: "https://source.unsplash.com/300x300/?city",
    },
  ],
});

export default OrgHierarchyChart;
