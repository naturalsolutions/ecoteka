import { FC } from "react";
import { Button, Dialog, DialogContent } from "@material-ui/core";
import { useState } from "react";
import Head from "next/head";

export interface NewsletterButtonProps {}

const NewsletterButton: FC<NewsletterButtonProps> = ({}) => {
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);

  const handleFormNewsletter = () => {
    setIsDialogOpen(true);

    // @ts-ignore
    hbspt.forms.create({
      region: "na1",
      portalId: "8711378",
      formId: "acf66b7b-3f02-41ac-8efa-005757f27d86",
      target: "#hubspot-form",
    });
  };

  const handleClose = () => {
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
          <form id="hubspot-form"></form>
        </DialogContent>
      </Dialog>
      <Button color="primary" variant="outlined" onClick={handleFormNewsletter}>
        {"s\u0027inscrire a la newsletter"}
      </Button>
    </>
  );
};

export default NewsletterButton;
