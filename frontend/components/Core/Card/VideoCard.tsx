import { useRef, useState } from "react";
import { findDOMNode } from "react-dom";
import { makeStyles } from "@material-ui/core/styles";
import Avatar from "@material-ui/core/Avatar";
import Box from "@material-ui/core/Box";
import Button from "@material-ui/core/Button";
import Card from "@material-ui/core/Card";
import CardMedia from "@material-ui/core/CardMedia";
import Typography from "@material-ui/core/Typography";
import PlayIcon from "@material-ui/icons/PlayArrow";
import { Row, Item } from "@/components/Core/Flex";
import { useCoverCardMediaStyles } from "@/styles/CardMedia/cover";
import { useArrowWhiteButtonStyles } from "@/styles/Button/arrowWhite";
import screenfull from "screenfull";
import ReactPlayer from "react-player/youtube";

import {} from "@material-ui/core";

const useStyles = makeStyles(({ palette }) => ({
  card: {
    minWidth: 320,
    position: "relative",
    boxShadow: "0 8px 24px 0 rgba(0,0,0,0.12)",
    overflow: "visible",
    borderRadius: "0.5rem",
    transition: "0.4s",
    "&:hover": {
      transform: "translateY(-2px)",
      "& $shadow": {
        bottom: "-1.5rem",
      },
      "& $shadow2": {
        bottom: "-2.5rem",
      },
    },
    "&:before": {
      content: '""',
      position: "absolute",
      zIndex: 0,
      display: "block",
      width: "100%",
      bottom: -1,
      height: "100%",
      borderRadius: "0.5rem",
      backgroundColor: "rgba(0,0,0,0.08)",
    },
  },
  main: {
    overflow: "hidden",
    borderTopLeftRadius: "0.5rem",
    borderTopRightRadius: "0.5rem",
    zIndex: 1,
    "&:after": {
      content: '""',
      position: "absolute",
      bottom: 0,
      display: "block",
      width: "100%",
      height: "100%",
      //
    },
  },
  content: {
    position: "absolute",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    bottom: 0,
    width: "100%",
    height: "100%",
    backgroundColor: "rgba(0, 0, 0, 0.39)",
    zIndex: 1,
    padding: "1.5rem 1.5rem 1rem",
  },
  avatar: {
    width: 48,
    height: 48,
  },
  caption: {
    zIndex: 1,
    position: "relative",
    borderBottomLeftRadius: "0.5rem",
    borderBottomRightRadius: "0.5rem",
    backgroundColor: palette.background.paper,
  },
  shadow: {
    transition: "0.2s",
    position: "absolute",
    zIndex: 0,
    width: "88%",
    height: "100%",
    bottom: 0,
    borderRadius: "0.5rem",
    backgroundColor: "rgba(0,0,0,0.06)",
    left: "50%",
    transform: "translateX(-50%)",
  },
  shadow2: {
    bottom: 0,
    width: "72%",
    backgroundColor: "rgba(0,0,0,0.04)",
  },
}));

export interface VideoCardProps {
  title: string;
  videoUrl: string;
  videoCapture: string;
}

// TODO: Add fullscreen video player
const VideoCard: React.FC<VideoCardProps> = ({
  title,
  videoUrl,
  videoCapture,
}) => {
  const styles = useStyles();
  const mediaStyles = useCoverCardMediaStyles({ bgPosition: "center" });
  const playButtonStyles = useArrowWhiteButtonStyles();
  const [play, setPlay] = useState(false);
  const player = useRef(null);

  const handlePlay = () => {
    if (screenfull.isEnabled) {
      screenfull.request(player.current);
    }
    setPlay(true);
  };

  return (
    <>
      <Card className={styles.card}>
        <Box className={styles.main} minHeight={300} position={"relative"}>
          <CardMedia classes={mediaStyles} image={videoCapture} />
          <Item className={styles.content} position="center">
            {!play && (
              <Button classes={playButtonStyles} onClick={() => handlePlay()}>
                <PlayIcon />
              </Button>
            )}
            {play && (
              <ReactPlayer
                ref={player}
                url={videoUrl}
                playing={play}
                width="100%"
                height="100%"
                onEnded={() => setPlay(false)}
                onPause={() => setPlay(false)}
              />
            )}
          </Item>
        </Box>
        <Row className={styles.caption} m={0} p={3} pt={2} gap={2}>
          <Typography variant="h6">{title}</Typography>
        </Row>
        <div className={styles.shadow} />
        <div className={`${styles.shadow} ${styles.shadow2}`} />
      </Card>
    </>
  );
};
export default VideoCard;
