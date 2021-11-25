import Header from "./Header";
import { Meta } from "@storybook/react";

export default {
  title: "Header/Header",
  component: Header,
  decorators: [
    (Story) => (
      <>
        <Story />
      </>
    ),
  ],
} as Meta;

export const Default = (args) => (
  <Header />
);
