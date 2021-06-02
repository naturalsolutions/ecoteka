import { FC } from "react";
import {
  makeStyles,
  Theme,
  Card,
  Typography,
  Grid,
  IconButton,
} from "@material-ui/core";
import LinkIcon from "@material-ui/icons/Link";
import { useRouter } from "next/router";

export interface SectionItemProps {
  title: string;
  subtitle: string;
  href?: string;
}

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    cursor: "pointer",
  },
  header: {
    display: "flex",
    padding: theme.spacing(2),
  },
  headerContent: {
    flex: 1,
  },
}));

const SectionItem: FC<SectionItemProps> = ({
  title,
  subtitle,
  href,
  children,
}) => {
  const classes = useStyles();
  const router = useRouter();

  const handleOnClick = (href): void => {
    if (href) {
      router.push(href);
    }
  };

  return (
    <Grid item xs={12} md={4}>
      <Card className={classes.root} onClick={() => handleOnClick(href)}>
        <div className={classes.header}>
          <div className={classes.headerContent}>
            <Typography variant="body2" color="textPrimary">
              {title}
            </Typography>
            <Typography variant="body2" color="textSecondary">
              {subtitle}
            </Typography>
          </div>
          <div>
            <IconButton>
              <LinkIcon />
            </IconButton>
          </div>
        </div>
        {children}
      </Card>
    </Grid>
  );
};

export default SectionItem;
