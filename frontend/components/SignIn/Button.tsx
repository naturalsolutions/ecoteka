import React, { useRef, useEffect } from "react";
import { Button, ButtonProps } from "@material-ui/core";
import { useTranslation } from "react-i18next";
import { useTemplate } from "../Template";
import ETKFormSignIn, { ETKFormSignInActions } from "./Form";

interface ETKFormSignInProps extends ButtonProps {
  open?: boolean;
  dialogTitle?: string;
}

const defaultProps: ETKFormSignInProps = {
  open: false,
};

const ETKSignInButton: React.FC<ETKFormSignInProps> = (props) => {
  const { t } = useTranslation("components");
  const { dialog } = useTemplate();
  const formRef = useRef<ETKFormSignInActions>();

  const { dialogTitle, open, ...buttonProps } = props;

  const onButtonClick = () => {
    const dialogActions = [
      {
        label: t("SignIn.buttonCancel"),
      },
      {
        label: t("SignIn.buttonConnexion"),
        variant: "contained",
        color: "primary",
        noClose: true,
        onClick: async () => {
          const isOk = await formRef.current.submit();

          if (isOk) {
            dialog.current.close();
          }
        },
      },
    ];

    dialog.current.open({
      title: dialogTitle || t("SignIn.title"),
      content: <ETKFormSignIn ref={formRef} />,
      actions: dialogActions,
      dialogProps: {
        maxWidth: "sm",
        fullWidth: true,
        disableBackdropClick: true,
      },
    });
  };

  useEffect(() => {
    if (open) {
      onButtonClick();
    }
  }, [open]);

  return (
    <Button
      onClick={onButtonClick}
      style={{ display: open ? "none" : "block" }}
      {...buttonProps}
    >
      {t("SignIn.buttonConnexion")}
    </Button>
  );
};

ETKSignInButton.defaultProps = defaultProps;

export default ETKSignInButton;
