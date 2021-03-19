// @ts-nocheck
import cx from "clsx";
import { makeStyles } from "@material-ui/core/styles";
import Avatar from "@material-ui/core/Avatar";
import Box from "@material-ui/core/Box";
import Card from "@material-ui/core/Card";
import CardMedia from "@material-ui/core/CardMedia";
import CardContent from "@material-ui/core/CardContent";
import IconButton from "@material-ui/core/IconButton";
import FavoriteBorderRounded from "@material-ui/icons/FavoriteBorderRounded";
import Share from "@material-ui/icons/Share";
import { useSoftRiseShadowStyles } from "@/styles/Shadow/softRise";
import { useSlopeCardMediaStyles } from "@/styles/CardMedia/slope";
import TextInfoContent from "@mui-treasury/components/content/textInfo";

const useStyles = makeStyles(() => ({
  root: {
    maxWidth: 304,
    margin: "auto",
  },
  content: {
    padding: 24,
  },
  avatar: {
    width: 50,
    height: 50,
    backgroundColor: "#fff",
    border: "2px solid #fff",
    margin: "-48px 32px 0 auto",
    "& > img": {
      margin: 0,
    },
  },
}));

const useTextInfoContentStyles = makeStyles(({ palette }) => ({
  overline: {
    textTransform: "uppercase",
    color: palette.text.secondary,
    letterSpacing: "1px",
    fontSize: 12,
    marginBottom: "0.875em",
    display: "inline-block",
  },
  heading: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: "0.4em",
  },
  body: {
    fontSize: 16,
    color: "rgba(0,0,0,0.72)",
  },
}));

export interface DatasetCardProps {
  imgUrl: string;
  heading: string;
  body: string;
  avatarUrl: string;
  path: string;
}

const DatasetCard: React.FC<DatasetCardProps> = ({
  imgUrl,
  heading,
  body,
  avatarUrl,
  path,
}) => {
  const cardStyles = useStyles();
  const mediaStyles = useSlopeCardMediaStyles();
  const shadowStyles = useSoftRiseShadowStyles();
  const textCardContentStyles = useTextInfoContentStyles();
  return (
    <Card className={cx(cardStyles.root, shadowStyles.root)}>
      <CardMedia classes={mediaStyles} image={imgUrl} />
      <Avatar className={cardStyles.avatar} src={avatarUrl} />
      <CardContent className={cardStyles.content}>
        <TextInfoContent
          classes={textCardContentStyles}
          heading={heading}
          body={body}
        />
      </CardContent>
      <Box px={2} pb={2} mt={-1}>
        <IconButton>
          <Share />
        </IconButton>
        <IconButton>
          <FavoriteBorderRounded />
        </IconButton>
      </Box>
    </Card>
  );
};

export default DatasetCard;
