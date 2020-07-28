import { useState } from "react";
import Drawer from "@material-ui/core/Drawer";
import Container from "@material-ui/core/Container";
import Grid from "@material-ui/core/Grid";
import ETKToolbar from "../components/Toolbar";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
  },
  appBarSpacer: theme.mixins.toolbar,
  content: {
    flexGrow: 1,
    height: "100vh",
    overflow: "auto",
  },
}));

export default function Index() {
  const classes = useStyles();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  return (
    <React.Fragment>
      <div className={classes.root} role="presentation">
        <ETKToolbar
          logo="/assets/light/logo.svg"
          numberOfTrees="4.6 millions of trees"
          aboutText="En savoir plus"
          onMenuClick={() => setIsDrawerOpen(!isDrawerOpen)}
        />

        <main className="content">
          <div className={classes.appBarSpacer} />
          <Container>
            <Grid container>
              <div>hello !</div>
            </Grid>
          </Container>
        </main>
      </div>
      <Drawer open={isDrawerOpen} onClose={() => setIsDrawerOpen(false)}>
        <div>aaaaa</div>
      </Drawer>
    </React.Fragment>
  );
}
