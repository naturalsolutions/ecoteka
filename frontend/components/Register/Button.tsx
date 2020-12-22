import React, { useRef } from "react";
import { Button, ButtonProps } from "@material-ui/core";
import { useTranslation } from "react-i18next";
import { useAppLayout } from "@/components/AppLayout/Base";
import ETKRegisterForm, {
  ETKFormRegisterActions,
} from "@/components/Register/Form";

const ETKRegisterButton: React.FC<ButtonProps> = (props) => {
  const { t } = useTranslation(["components", "common"]);
  const { dialog } = useAppLayout();
  const formRef = useRef<ETKFormRegisterActions>();

  const onButtonClick = async () => {
    dialog.current.open({
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
          color: "primary",
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
        content: t("components:Register.registrationCompleted"),
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
