import { useTranslation } from "react-i18next";
import { Box, Button, Card, CardMedia, Typography } from "@material-ui/core";
import AddIcon from "@material-ui/icons/Add";
import { makeStyles } from "@material-ui/core/styles";
import { useCoverCardMediaStyles } from "@/styles/CardMedia/cover";
import { useArrowWhiteButtonStyles } from "@/styles/Button/arrowWhite";

const useStyles = makeStyles(({ palette, spacing }) => ({
  card: {
    width: "100%",
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
    width: "100%",
    paddingTop: "80%",
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
    color: palette.grey[600],
    fontWeight: 600,
    fontSize: "1.25rem",
  },
}));

export interface AddOrganizationProps {
  title?: string;
  videoUrl?: string;
  videoCapture?: string;
}

// TODO: Add fullscreen video player
const AddOrganization: React.FC<AddOrganizationProps> = ({
  title,
  videoUrl,
  videoCapture,
}) => {
  const styles = useStyles();
  const { t } = useTranslation(["components"]);
  const mediaStyles = useCoverCardMediaStyles({ bgPosition: "center" });
  const addButtonStyles = useArrowWhiteButtonStyles();

  const handleAddOrganization = () => {
    //
  };

  return (
    <Card className={styles.card}>
      <Box className={styles.main} height={290} position={"relative"}>
        <CardMedia classes={mediaStyles} image={""} />
        <Box className={styles.content} position="center">
          <Button classes={addButtonStyles} onClick={handleAddOrganization}>
            <AddIcon />
          </Button>
        </Box>
      </Box>
      <Box className={styles.caption} m={0} p={3} pt={2}>
        {t("components.CallToActions.AddOrganization.title")}
      </Box>
    </Card>
  );
};
export default AddOrganization;
