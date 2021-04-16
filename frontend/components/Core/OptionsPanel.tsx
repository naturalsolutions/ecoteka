import { FC, ReactElement } from "react";
import {
  makeStyles,
  Theme,
  Paper,
  Grid,
  Typography,
  IconButton,
  Menu,
  MenuItem,
} from "@material-ui/core";
import { MoreVert } from "@material-ui/icons";
import { useState } from "react";
import { useRouter } from "next/router";

export interface Item {
  title: string;
  href: string;
}

export interface CoreOptionsPanelProps {
  title: string | ReactElement;
  items: Item[];
}

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    padding: theme.spacing(2),
  },
  title: {
    textTransform: "uppercase",
    fontWeight: 700,
  },
  content: {
    marginTop: theme.spacing(2),
  },
}));

const CoreOptionsPanel: FC<CoreOptionsPanelProps> = ({
  title,
  items = [],
  children,
}) => {
  const classes = useStyles();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const router = useRouter();

  const handleOpen = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleItemClick = (item) => {
    handleClose();

    if (item.href) {
      router.push(item.href);
    }
  };

  return (
    <Paper className={classes.root}>
      <Grid container alignItems="center">
        <Grid item xs>
          <Typography variant="body2" className={classes.title}>
            {title}
          </Typography>
        </Grid>
        <Grid item>
          <IconButton size="small" onClick={handleOpen}>
            <MoreVert />
          </IconButton>
        </Grid>
      </Grid>
      <div className={classes.content}>{children}</div>
      <Menu
        anchorOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
      >
        {items.map((item) => (
          <MenuItem key={item.title} onClick={() => handleItemClick(item)}>
            {item.title}
          </MenuItem>
        ))}
      </Menu>
    </Paper>
  );
};

export default CoreOptionsPanel;
