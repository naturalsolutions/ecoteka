import React, { useRef, useEffect } from "react";
import { Button, ButtonProps } from "@material-ui/core";
import { useTranslation } from "react-i18next";
import { useAppLayout } from "@/components/AppLayout/Base";
import FormSignIn, { FormSignInActions } from "@/components/SignIn/Form";

interface FormSignInProps extends ButtonProps {
  open?: boolean;
  dialogTitle?: string;
}

const defaultProps: FormSignInProps = {
  open: false,
};

const ETKSignInButton: React.FC<FormSignInProps> = (props) => {
  const { t } = useTranslation("components");
  const { dialog } = useAppLayout();
  const formRef = useRef<FormSignInActions>();

  const { dialogTitle, open, ...buttonProps } = props;

  const onButtonClick = () => {
    const dialogActions = [
      {
        label: t("components.SignIn.buttonCancel"),
      },
      {
        label: t("components.SignIn.buttonConnexion"),
        variant: "contained",
        color: "secondary",
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
      title: dialogTitle || t("components.SignIn.title"),
      content: <FormSignIn ref={formRef} />,
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
      {t("components.SignIn.buttonConnexion")}
    </Button>
  );
};

ETKSignInButton.defaultProps = defaultProps;

export default ETKSignInButton;
