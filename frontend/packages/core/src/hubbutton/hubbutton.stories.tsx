import HubButton from "./hubbutton";
import { Meta } from "@storybook/react";

export default {
  title: "HotSpot/Button",
  component: HubButton,
  decorators: [
    (Story) => (
      <>
        <Story />
      </>
    ),
  ],
} as Meta;

export const Default = (args) => (
  <HubButton message={args.message} formId="222" color="primary" />
);

Default.args = {
  message: "Contact",
};
