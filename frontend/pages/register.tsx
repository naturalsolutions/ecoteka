import { useEffect, useRef, useState } from "react";
import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  CircularProgress,
  Grid,
  Typography,
} from "@material-ui/core";
import ETKFormRegister, {
  ETKFormRegisterActions,
} from "@/components/Register/Form";
import { useRouter } from "next/router";
import Link from "next/link";
import { useAppContext } from "@/providers/AppContext";
import AppLayoutGeneral from "@/components/AppLayout/General";
import { useTranslation } from "react-i18next";

export default function SignInPage() {
  const formRef = useRef<ETKFormRegisterActions>();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAppContext();
  const { t } = useTranslation("components");

  const onSubmit = async () => {
    setIsLoading(true);
    const isOk = await formRef.current.submit();
    setIsLoading(false);

    if (isOk) {
      router.push("/edition/");
    }
  };

  useEffect(() => {
    if (!user?.is_superuser) {
      router.push("/");
    }
  }, [user]);

  return (
    <AppLayoutGeneral>
      <Grid
        container
        spacing={0}
        direction="column"
        alignItems="center"
        justify="center"
        style={{ minHeight: "calc(100vh - 48px)" }}
      >
        {user?.is_superuser && (
          <Card>
            <CardContent>
              <Typography variant="h6" align="center">
                {t("Register.dialogTitle")}
              </Typography>
              <ETKFormRegister ref={formRef}></ETKFormRegister>
            </CardContent>
            <CardActions disableSpacing>
              <Box flexGrow={1} />
              <Button
                color="primary"
                variant="contained"
                onClick={onSubmit}
                disabled={isLoading}
              >
                {isLoading ? <CircularProgress size={30} /> : t("Register.validationButton")}
              </Button>
            </CardActions>
          </Card>
        )}
      </Grid>
    </AppLayoutGeneral>
  );
}
