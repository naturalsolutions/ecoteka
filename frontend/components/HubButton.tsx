import { FC } from "react";
import { Button, Dialog, DialogContent, ButtonProps } from "@material-ui/core";
import { useState } from "react";
import Head from "next/head";

interface HubButtonProps {
  message: string;
  variant: ButtonProps["variant"];
  buttonClassName?: string;
  formId: string;
  color: ButtonProps["color"];
}

const HubButton: FC<HubButtonProps> = ({
  message,
  variant,
  buttonClassName,
  formId,
  color,
}) => {
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);

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
          <form id="hubspot-forms"></form>
        </DialogContent>
      </Dialog>
      <Button
        color={color}
        variant={variant}
        onClick={handleFormHubButton}
        className={buttonClassName}
      >
        {message}
      </Button>
    </>
  );
};

export default HubButton;
