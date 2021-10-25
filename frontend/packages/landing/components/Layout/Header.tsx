import { FC, useState, useEffect, useMemo } from "react";
import { Grid, makeStyles, Paper } from "@material-ui/core";
import MenuItems from "@/components/Menu/Items";
import { MenuItemProps } from "@/components/Menu/Item";
import MenuIcon from "@/components/Menu/Icon";
import Logo from "@/components/Logo/Index";
import { useTranslation } from "react-i18next";
import { EcotekaTheme } from "@/theme/config";
import getConfig from "next/config";

const { publicRuntimeConfig } = getConfig();

const useStyles = makeStyles((theme: EcotekaTheme) => ({
  root: {
    height: 64,
    background: theme.palette.background.default,
    [theme.breakpoints.up("md")]: {
      height: 100,
    },
  },
  grid: {
    height: "100%",
    paddingLeft: 20,
    paddingRight: 40,
  },
}));

const LayoutHeader: FC = () => {
  const classes = useStyles();
  const { t } = useTranslation();
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
  const isStudioReady = publicRuntimeConfig.isStudioReady;
  const MENU_ITEMS: MenuItemProps[] = [
    {
      label: t("layout.header.menuItems.contact"),
      href: "https://www.natural-solutions.eu/contacts",
    },
    {
      label: t("layout.header.menuItems.about"),
      href: "https://www.natural-solutions.eu/ecoteka",
    },
  ];
  const [items, setItems] = useState<MenuItemProps[]>([...MENU_ITEMS]);

  const signinItem = useMemo(() => {
    return {
      label: t("layout.header.menuItems.signin"),
      href: "https://ecoteka.org/signin",
    };
  }, [t]);

  useEffect(() => {
    if (isStudioReady) {
      setItems((items) => [...items, signinItem]);
    }
  }, [isStudioReady, signinItem]);

  const handleOnMenuIconChange = (isOpen: boolean): void => {
    setIsMenuOpen(isOpen);
  };

  return (
    <Paper square elevation={0} className={classes.root}>
      <Grid container className={classes.grid}>
        <Grid
          container
          direction="row"
          justifyContent="flex-start"
          alignItems="center"
        >
          <Grid item>
            <Logo />
          </Grid>
          <Grid item xs />
          <Grid item>
            <MenuIcon onChange={handleOnMenuIconChange} />
            <MenuItems items={items} open={isMenuOpen} />
          </Grid>
        </Grid>
      </Grid>
    </Paper>
  );
};

export default LayoutHeader;
