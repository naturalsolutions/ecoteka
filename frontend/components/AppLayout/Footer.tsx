import { FC } from "react";
import { makeStyles, Container, Grid, Button, Link } from "@material-ui/core";
import { List } from "@material-ui/core";
import { ListItem } from "@material-ui/core";
import { EcotekaTheme } from "@/theme/config";

const useStyles = makeStyles((theme: EcotekaTheme) => ({
  root: {
    backgroundColor: theme.palette.background.dark,
    padding: "60px 0",
  },
  text: {
    color: theme.palette.getContrastText(theme.palette.background.dark),
  },
}));

const LayoutFooter: FC = () => {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <Container>
        <Grid container spacing={6}>
          <Grid item xs={12} md={4}>
            <List>
              <ListItem>
                <Link className={classes.text}>En savoir plus sur ecoTeka</Link>
              </ListItem>
              <ListItem>
                <Link className={classes.text}>
                  {`Plus qu\u0027un produit, une communauté`}
                </Link>
              </ListItem>
              <ListItem>
                <Link className={classes.text}>Retrouvez-nous sur Gitlab</Link>
              </ListItem>
              <ListItem>
                <Link className={classes.text}>
                  Le projet maintenant et à venir
                </Link>
              </ListItem>
            </List>
          </Grid>
          <Grid item xs={12} md={4}>
            <List>
              <ListItem>
                <Link className={classes.text}>
                  En savoir plus sur Natural Solutions
                </Link>
              </ListItem>
              <ListItem>
                <Link className={classes.text}>Site internet</Link>
              </ListItem>
              <ListItem>
                <Link className={classes.text}>{`L\u0027équipe`}</Link>
              </ListItem>
              <ListItem>
                <Link className={classes.text}>
                  {`Suivre l\u0027actualité sur les écosystèmes urbains`}
                </Link>
              </ListItem>
            </List>
          </Grid>
          <Grid item xs={12} md={4}>
            <List>
              <ListItem>
                <Button color="primary" variant="outlined">
                  {"s\u0027inscrire a la newsletter"}
                </Button>
              </ListItem>
            </List>
          </Grid>
        </Grid>
      </Container>
    </div>
  );
};

export default LayoutFooter;
