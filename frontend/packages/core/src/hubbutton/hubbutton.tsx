import React from "react";
import { Button, Dialog, DialogContent, ButtonProps } from "@material-ui/core";
import Head from "next/head";

interface HubButtonProps {
  message: string;
  variant?: ButtonProps["variant"];
  formId: string;
  buttonClassName?: string;
  color: ButtonProps["color"];
}

const HubButton: React.FC<HubButtonProps> = ({
  message,
  variant,
  buttonClassName,
  formId,
  color,
}) => {
  const [isDialogOpen, setIsDialogOpen] = React.useState<boolean>(false);

  const handleFormHubButton = (): void => {
    setIsDialogOpen(true);

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    hbspt.forms.create({
      region: "na1",
      portalId: "8711378",
      formId: formId,
      target: "#hubspot-forms",
    });
  };

  const handleClose = (): void => {
    setIsDialogOpen(false);
  };

  return (
    <>
      <Head>
        <script type="text/javascript" src="//js.hsforms.net/forms/shell.js" />
      </Head>
      <Dialog
        open={isDialogOpen}
        aria-labelledby="customized-dialog-title"
        onClose={handleClose}
      >
        <DialogContent>
          <form id="hubspot-forms" />
        </DialogContent>
      </Dialog>
      <Button
        color={color}
        variant={variant}
        onClick={handleFormHubButton}
        className={buttonClassName}
      >
        javi{message}
      </Button>
    </>
  );
};

export default HubButton;
