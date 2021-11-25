import Logo from "./Logo";
import { Meta } from "@storybook/react";

export default {
  title: "Header/Logo",
  component: Logo,
  decorators: [
    (Story) => (
      <>
        <Story />
      </>
    ),
  ],
} as Meta;

export const Default = (args) => (
  <Logo height={args.height} width={args.width} />
);

Default.args = {
  height: "50",
  width: "120",
};