import React, { useRef } from "react";
import { Button, ButtonProps, Grid, Typography } from "@material-ui/core";
import CheckCircleIcon from "@material-ui/icons/CheckCircle";
import { useTranslation } from "react-i18next";
import { useTemplate } from "../Template";
import ETKForgotPasswordForm, { ETKFormForgotPasswordActions } from "./Form";

const ETKForgotPasswordButton: React.FC<ButtonProps> = (props) => {
  const { t } = useTranslation(["components", "common"]);
  const { dialog, theme } = useTemplate();
  const formRef = useRef<ETKFormForgotPasswordActions>();

  const onButtonClick = async () => {
    dialog.current.open({
      title: t("components:ForgotPassword.dialogTitle"),
      content: <ETKForgotPasswordForm ref={formRef} />,
      actions: [
        {
          label: t("components:ForgotPassword.cancel"),
        },
        {
          label: t("components:ForgotPassword.submit"),
          noClose: true,
          variant: "contained",
          color: "secondary",
          onClick: onSubmitClick,
        },
      ],
      dialogProps: {
        maxWidth: "sm",
        fullWidth: true,
        disableBackdropClick: true,
      },
    });
  };

  const onSubmitClick = async () => {
    const valid = await formRef.current.submit();

    if (valid) {
      dialog.current.open({
        title: t("common:messages.success"),
        content: t("components:ForgotPassword.formCompleted"),
        actions: [{ label: "ok" }],
      });
    }
  };

  return (
    <Button onClick={onButtonClick} {...props}>
      {t("components:ForgotPassword.buttonTitle")}
    </Button>
  );
};

export default ETKForgotPasswordButton;
