import React, { useRef } from "react";
import { Button, ButtonProps, Grid, Typography } from "@material-ui/core";
import CheckCircleIcon from "@material-ui/icons/CheckCircle";
import { useTranslation } from "react-i18next";
import { useTemplate } from "../Template";
import ETKRegisterForm, { ETKFormRegisterActions } from "./Form";

const ETKRegisterButton: React.FC<ButtonProps> = (props) => {
  const { t } = useTranslation(["components", "common"]);
  const { dialog, theme } = useTemplate();
  const formRef = useRef<ETKFormRegisterActions>();

  const onButtonClick = async () => {
    dialog.open({
      title: t("components:Register.dialogTitle"),
      content: <ETKRegisterForm ref={formRef} />,
      actions: [
        {
          label: t("components:Register.cancel"),
        },
        {
          label: t("components:Register.submit"),
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
    try {
      const valid = await formRef.current.submit();

      if (valid) {
        dialog.open({
          title: t("common:messages.success"),
          content: (
            <React.Fragment>
              {t("components:Register.registrationCompleted")}
            </React.Fragment>
          ),
          actions: [{ label: "ok" }],
        });
      }
    } catch (e) {
      dialog.open({
        title: t("common:messages.error"),
        content: (
          <React.Fragment>
            {t("components:Register.registrationFailed")}
          </React.Fragment>
        ),
        actions: [{ label: "ok" }],
      });
    }
  };

  return (
    <Button onClick={onButtonClick} {...props}>
      {t("Toolbar.register")}
    </Button>
  );
};

export default ETKRegisterButton;
