import EcotekaAppBar from "./AppBar";
import { Meta } from "@storybook/react";
import {
  ThemeProvider as MUIThemeProvider,
  createTheme,
} from "@material-ui/core";

export default {
  title: "Ecoteka/AppBar",
  component: EcotekaAppBar,
  decorators: [(Story) => <Story />],
} as Meta;

export const Default = (args) => (
  <>
    <EcotekaAppBar>{args.componentType}</EcotekaAppBar>
  </>
);

Default.args = {
  componentType: "AppBar",
};
