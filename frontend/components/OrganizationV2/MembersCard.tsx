import React from "react";
import cx from "clsx";
import Avatar from "@material-ui/core/Avatar";
import Button from "@material-ui/core/Button";
import Divider from "@material-ui/core/Divider";
import Link from "@material-ui/core/Link";
import { makeStyles } from "@material-ui/core/styles";
import { Column, Row, Item } from "@/components/Core/Flex";
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
    <Row gap={2} p={2.5}>
      <Item>
        <Avatar classes={avatarStyles} src={src} />
      </Item>
      <Row wrap grow gap={0.5} minWidth={0}>
        <Item grow minWidth={0}>
          <div className={cx(styles.name, styles.text)}>{name}</div>
        </Item>
        <Item position={"middle"}>
          <Button className={styles.btn} variant={"outlined"}>
            {role}
          </Button>
        </Item>
      </Row>
    </Row>
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
    <Column p={0} gap={0} my={2} className={styles.card} grow>
      <Row wrap p={2} alignItems={"baseline"} className={styles.header}>
        <Item stretched className={styles.headline}>
          Membres (N)
        </Item>
        <Item className={styles.actions}>
          <Link className={styles.link}>En savoir plus</Link> •{" "}
          <Link className={styles.link}>Gérer les membres</Link>
        </Item>
      </Row>
      <PersonItem
        name={"Vous"}
        friendCount={6}
        src={"https://source.unsplash.com/300x300/?forest"}
        role={"owner"}
      />
      <Divider variant={"middle"} className={styles.divider} />
      <PersonItem
        name={"Camellia Sinensis"}
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
    </Column>
  );
};

export default MembersCard;
