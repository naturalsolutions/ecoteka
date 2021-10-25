import { useRef, useState } from "react";
import { Box, Button, Card, CardMedia, Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import PlayIcon from "@material-ui/icons/PlayArrow";
import { useCoverCardMediaStyles } from "@/styles/CardMedia/cover";
import { useArrowWhiteButtonStyles } from "@/styles/Button/arrowWhite";
import screenfull from "screenfull";
import ReactPlayer from "react-player/youtube";

const useStyles = makeStyles(({ palette }) => ({
  card: {
    width: "100%",
    position: "relative",
    boxShadow: "0 8px 24px 0 rgba(0,0,0,0.12)",
    overflow: "visible",
    borderRadius: "0.5rem",
    transition: "0.4s",
    "&:hover": {
      transform: "translateY(-2px)",
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
    width: "100%",
    paddingTop: "56.25%",
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
    <Card className={styles.card}>
      <Box className={styles.main} position={"relative"}>
        <CardMedia classes={mediaStyles} image={videoCapture} />
        <Box className={styles.content} position="center">
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
        </Box>
      </Box>
      <Box className={styles.caption} m={0} p={3} pt={2}>
        <Typography variant="h6">{title}</Typography>
      </Box>
      <div className={styles.shadow} />
      <div className={`${styles.shadow} ${styles.shadow2}`} />
    </Card>
  );
};
export default VideoCard;
