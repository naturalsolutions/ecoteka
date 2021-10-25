import { FC, ReactElement } from "react";
import MenuItem, { MenuItemProps } from "@/components/Menu/Item";
import { Grid, makeStyles, createStyles, Theme } from "@material-ui/core";

export interface MenuItemsProps {
  open: boolean;
  items: MenuItemProps[];
}

const useStyles = makeStyles<Theme, MenuItemsProps>((theme) =>
  createStyles({
    root: {
      transition: "opacity .3s ease-in-out, visibility .3s ease-in-out",
      [theme.breakpoints.down("sm")]: {
        opacity: ({ open }) => (open ? "1" : "0"),
        visibility: ({ open }) => (open ? "visible" : "hidden"),
        background: "#fff",
        width: "100%",
        height: "100vh",
        position: "absolute",
        left: 0,
        top: 0,
        zIndex: 1,
      },
    },
    menuItems: {
      listStyleType: "none",
      margin: 0,
      flexDirection: "column",
      padding: "5rem 2rem 0 2rem",
      [theme.breakpoints.up("md")]: {
        flexDirection: "row",
        padding: 0,
      },
    },
  })
);

const MenuItems: FC<MenuItemsProps> = (props) => {
  const { items } = props;
  const classes = useStyles(props);
  const renderMenuItems = (itemsParams): ReactElement[] => {
    return itemsParams.map((params, index) => {
      return <MenuItem key={index} {...params} />;
    });
  };

  return (
    <nav className={classes.root}>
      <Grid container component="ul" className={classes.menuItems}>
        {renderMenuItems(items)}
      </Grid>
    </nav>
  );
};

export default MenuItems;
