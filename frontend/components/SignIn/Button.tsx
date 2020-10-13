import React, { useRef } from "react";
import { Button, ButtonProps } from "@material-ui/core";
import { useTranslation } from "react-i18next";
import { useTemplate } from "../Template";
import ETKFormSignIn, { ETKFormSignInActions } from "./Form";

const ETKSignInButton: React.FC<ButtonProps> = (props) => {
  const { t } = useTranslation("components");
  const { dialog } = useTemplate();
  const formRef = useRef<ETKFormSignInActions>();

  const onButtonClick = () => {
    const dialogActions = [
      {
        label: t("SignIn.buttonCancel"),
      },
      {
        label: t("SignIn.buttonConnexion"),
        variant: "contained",
        color: "secondary",
        noClose: true,
        onClick: async () => {
          const isOk = await formRef.current.submit();

          if (isOk) {
            dialog.close();
          }
        },
      },
    ];

    dialog.open({
      title: t("SignIn.title"),
      content: <ETKFormSignIn ref={formRef} />,
      actions: dialogActions,
      dialogProps: {
        maxWidth: "sm",
        fullWidth: true,
        disableBackdropClick: true,
      },
    });
  };

  return (
    <Button onClick={onButtonClick} {...props}>
      {t("SignIn.buttonConnexion")}
    </Button>
  );
};

export default ETKSignInButton;
