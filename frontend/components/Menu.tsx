import React, { useEffect } from "react";
import { useRouter } from "next/router";
import {
  makeStyles,
  Tabs,
  Tab,
  Paper,
  Collapse,
  Button,
  Grid,
  Card,
  CardContent,
} from "@material-ui/core";
import { useTranslation } from "react-i18next";

export interface ETKMenuItem {
  label: string;
  link: string | undefined;
  icon: any;
  children: ETKMenuItem[] | undefined;
  disabled: boolean | undefined;
  highlighted: boolean | undefined;
  activator?(router: any): boolean;
}

export interface ETKMenuProps {
  items: ETKMenuItem[];
}

const defaultProps: ETKMenuProps = {
  items: [],
};

const useStyles = makeStyles(() => ({
  root: {},
  accordion: {
    "& .Mui-expanded": {
      margin: 0,
      minHeight: 0,
    },
    "& .MuiAccordionSummary-content": {
      margin: 0,
    },
  },
  accordionSummary: {
    margin: 0,
  },
  button: {
    textTransform: "none",
    display: "block",
    textAlign: "left",
  },
  highlighted: {
    background: "#00796a",
    "& *": {
      color: "#fff",
    },
  },
  active: {
    fontWeight: "bold",
  },
}));

const ETKMenu: React.FC<ETKMenuProps> = (props) => {
  const router = useRouter();
  const { t } = useTranslation("components");
  const classes = useStyles();
  const [value, setValue] = React.useState(0);
  const [isExpanded, setIsExpanded] = React.useState(false);
  const [tree] = React.useState(props.items);
  const [width] = React.useState(220);

  useEffect(() => {
    tree.map((parent, index) =>
      parent.children.map((child) => {
        if (child.activator && child.activator(router)) {
          setValue(index);
        }
      })
    );
  }, [router]);

  const handleChange = (event: React.ChangeEvent<{}>, newValue: number) => {
    setValue(newValue);
  };

  const onTabsClick = (i) => {
    if (!isExpanded || i === value) {
      setIsExpanded(!isExpanded);
    }

    setValue(i);
  };

  const renderTab = (item, index) => {
    return (
      <Tab
        onClick={() => onTabsClick(index)}
        key={index}
        style={{ minWidth: `${width}px` }}
        className={item.highlighted ? classes.highlighted : ""}
        label={
          <Grid
            container
            direction="row"
            justify="flex-start"
            alignItems="center"
            spacing={1}
          >
            <Grid item>{item.icon}</Grid>
            <Grid item>{t(item.label)}</Grid>
          </Grid>
        }
      />
    );
  };

  const renderChildren = (parent, indexParent) => {
    return (
      <Card
        key={`card-parent-${indexParent}`}
        style={{
          width: `${width}px`,
        }}
        className={parent.highlighted ? classes.highlighted : ""}
        elevation={0}
        square
      >
        <CardContent>
          <Grid item>
            <Grid
              container
              direction="column"
              justify="flex-start"
              alignItems="stretch"
            >
              {parent.children.map((child, indexChild) => {
                return (
                  <Grid key={`grid-child-${indexChild}`} item>
                    <Button
                      disabled={child.disabled}
                      fullWidth
                      size="small"
                      className={`${classes.button} ${
                        child.activator && child.activator(router)
                          ? classes.active
                          : ""
                      }`}
                      onClick={() => {
                        if (child.link) {
                          router.push(child.link);
                          onTabsClick(indexParent);
                          setIsExpanded(false);
                        }
                      }}
                    >
                      {t(child.label)}
                    </Button>
                  </Grid>
                );
              })}
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    );
  };

  return (
    <Paper elevation={0} square>
      <Collapse
        in={isExpanded}
        collapsedHeight={48}
        className={classes.accordion}
      >
        <Tabs
          value={value}
          onChange={handleChange}
          indicatorColor="primary"
          textColor="primary"
        >
          {tree.map((item, index) => renderTab(item, index))}
        </Tabs>
        <Grid container>
          {tree.map((parent, index) => renderChildren(parent, index))}
        </Grid>
      </Collapse>
    </Paper>
  );
};

ETKMenu.defaultProps = defaultProps;

export default ETKMenu;
