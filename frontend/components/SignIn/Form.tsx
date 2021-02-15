import React, {
  forwardRef,
  useImperativeHandle,
  useState,
  useEffect,
} from "react";
import { Box, Grid } from "@material-ui/core";
import { useTranslation } from "react-i18next";
import useETKForm from "@/components/Form/useForm";
import useETKSignInSchema from "@/components/SignIn/Schema";
import useAPI from "@/lib/useApi";
import { useAppContext } from "@/providers/AppContext";
import getConfig from "next/config";

export type FormSignInActions = {
  submit: () => Promise<boolean>;
};

export interface FormSignInProps {
  onSubmit?(): void;
}

const defaultProps: FormSignInProps = {};

const FormSignIn = forwardRef<FormSignInActions, FormSignInProps>(
  ({ onSubmit }, ref) => {
    const { t } = useTranslation("components");
    const schema = useETKSignInSchema();
    const [login, setLogin] = useState(false);

    schema.password.component.onKeyDown = async (e) => {
      if (e.keyCode == 13) {
        setLogin(true);
      }
    };

    const { fields, handleSubmit, setError, errors, trigger } = useETKForm({
      schema: schema,
    });
    const { setUser } = useAppContext();
    const { apiETK } = useAPI().api;
    let logged = false;
    const { publicRuntimeConfig } = getConfig();
    const { tokenStorage, refreshTokenStorage } = publicRuntimeConfig;

    useEffect(() => {
      if (login) {
        onSubmit();
        setLogin(false);
      }
    }, [login]);

    const handleOnSubmit = async ({ username, password }) => {
      const params = new URLSearchParams();
      params.append("username", username);
      params.append("password", password);

      const config = {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      };
      try {
        const response = await apiETK.post("auth/login", params, config);
        const { data, status } = response;

        if (status === 200) {
          try {
            const { data: newUser } = await apiETK.get("/users/me", {
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${data.access_token}`,
              },
            });

            if (newUser) {
              setUser({
                ...newUser,
                currentOrganization: newUser.organizations[0],
              });
              localStorage.setItem(tokenStorage, data.access_token);
              localStorage.setItem(refreshTokenStorage, data.refresh_token);
              logged = true;
            }
          } catch (error) {}
        }

        return data;
      } catch (error) {
        setError("username", {
          type: "manual",
          message: t("components.SignIn.errorMessageServer"),
        });
        setError("password", {
          type: "manual",
          message: t("components.SignIn.errorMessageServer"),
        });
      }
    };

    const submit = handleSubmit(handleOnSubmit);

    useImperativeHandle(ref, () => ({
      submit: async () => {
        await submit();
        return logged;
      },
    }));

    return (
      <Box width={1}>
        <form>
          <Grid container direction="column">
            <Grid item>{fields.username}</Grid>
            <Grid item>{fields.password}</Grid>
          </Grid>
        </form>
      </Box>
    );
  }
);

FormSignIn.defaultProps = defaultProps;

export default FormSignIn;
