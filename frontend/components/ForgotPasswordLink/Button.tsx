import React, { useRef } from "react";
import { Button, ButtonProps, Grid, Typography } from "@material-ui/core";
import CheckCircleIcon from "@material-ui/icons/CheckCircle";
import { useTranslation } from "react-i18next";
import { useRouter } from "next/router";
import { useTemplate } from "../Template";
import ETKForgotPasswordLinkForm, { ETKFormForgotPasswordLinkActions } from "./Form";

const ETKForgotPasswordLinkButton: React.FC<ButtonProps> = (props) => {
  const router = useRouter();
  const { t } = useTranslation(["components", "common"]);
  const { dialog, theme } = useTemplate();
  const formRef = useRef<ETKFormForgotPasswordLinkActions>();

  const onButtonClick = async () => {
    dialog.current.open({
      title: t("components:ForgotPasswordLink.dialogTitle"),
      content: <ETKForgotPasswordLinkForm ref={formRef} value={router.query.value}/>,
      actions: [
        {
          label: t("components:ForgotPasswordLink.cancel"),
        },
        {
          label: t("components:ForgotPasswordLink.submit"),
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
        content: t("components:ForgotPasswordLink.formCompleted"),
        actions: [{ label: "ok" }],
      });
    }
  };

  return (
    <Button onClick={onButtonClick} {...props}>
      {t("components:ForgotPasswordLink.buttonTitle")}
    </Button>
  );
};

export default ETKForgotPasswordLinkButton;
