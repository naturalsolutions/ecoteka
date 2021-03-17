import React from "react";
import cx from "clsx";
import { makeStyles } from "@material-ui/core/styles";
import {
  Box,
  Grid,
  Typography,
  Avatar,
  Divider,
  Button,
  Link,
} from "@material-ui/core";
import { useDynamicAvatarStyles } from "@mui-treasury/styles/avatar/dynamic";

const usePersonStyles = makeStyles(() => ({
  text: {
    fontFamily: "Inter, sans-serif",
    whiteSpace: "nowrap",
    textOverflow: "ellipsis",
    overflow: "hidden",
  },
  name: {
    fontWeight: 600,
    fontSize: "1rem",
    color: "#122740",
  },
  caption: {
    fontSize: "0.875rem",
    color: "#758392",
    marginTop: -4,
  },
  btn: {
    borderRadius: 20,
    padding: "0.125rem 0.75rem",
    borderColor: "#becddc",
    fontSize: "0.75rem",
  },
}));

const PersonItem = ({ src, name, friendCount, role }) => {
  const avatarStyles = useDynamicAvatarStyles({ size: 56 });
  const styles = usePersonStyles();
  return (
    <Grid item container spacing={2}>
      <Grid item xs={1} md={3}>
        <Avatar src={src} />
      </Grid>
      <Grid item container xs={11} md={9}>
        <Grid item xs zeroMinWidth>
          <Typography noWrap className={cx(styles.name, styles.text)}>
            {name}
          </Typography>
        </Grid>
        <Grid item>
          <Button className={styles.btn} variant={"outlined"}>
            {role}
          </Button>
        </Grid>
      </Grid>
    </Grid>
  );
};

const useStyles = makeStyles(() => ({
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

export const MembersCard: React.FC = (props) => {
  const styles = useStyles();
  return (
    <Grid
      container
      direction="column"
      className={styles.card}
      xs={12}
      spacing={2}
    >
      <Grid item container className={styles.header}>
        <Grid item xs className={styles.headline}>
          <Box p={1}> Membres (N)</Box>
        </Grid>
        <Grid item xs className={styles.actions}>
          <Box p={1}>
            <Link className={styles.link}>En savoir plus</Link> •{" "}
            <Link className={styles.link}>Gérer les membres</Link>
          </Box>
        </Grid>
      </Grid>
      <PersonItem
        name={"Vous"}
        friendCount={6}
        src={"https://source.unsplash.com/300x300/?forest"}
        role={"owner"}
      />
      <Divider variant={"middle"} className={styles.divider} />
      <PersonItem
        name={"Camellia Sinensis Machin Truc"}
        friendCount={6}
        src={"https://source.unsplash.com/300x300/?tree"}
        role={"manager"}
      />
      <Divider variant={"middle"} className={styles.divider} />
      <PersonItem
        name={"Abies Alba"}
        friendCount={2}
        src={"https://source.unsplash.com/300x300/?tree"}
        role={"contributor"}
      />
      <Divider variant={"middle"} className={styles.divider} />
      <PersonItem
        name={"Tilia Cordata"}
        friendCount={2}
        src={"https://source.unsplash.com/300x300/?tree"}
        role={"reader"}
      />
    </Grid>
  );
};

export default MembersCard;
