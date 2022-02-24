import { createRef } from "react";
import { render, screen, fireEvent } from "@/__tests__/utils/test-utils";
import userEvent from "@testing-library/user-event";
import SignInForm, { FormSignInActions } from "@/components/Login/FormSignIn";
import { act } from "@testing-library/react";
import translations from "@/public/locales/fr/components.json";

let ref, form, username, password, handleOnSubmit;

beforeEach(() => {
  handleOnSubmit = jest.fn();
  ref = createRef<FormSignInActions>();
  form = render(<SignInForm ref={ref} onSubmit={handleOnSubmit} />);
  username = form.getByTestId("signin-form-email");
  password = form.getByTestId("signin-form-password");
});

const login = async () => {
  let response;

  await act(async () => {
    response = await ref.current.submit();
  });

  return response;
};

test("success login", async () => {
  userEvent.type(username, "admin@ecoteka.natural-solutions.eu");
  userEvent.type(password, "password");

  const { logged, user } = await login();

  expect(localStorage.getItem("%token_storage%")).toBeDefined();
  expect(localStorage.getItem("%refresh_token_storage%")).toBeDefined();
  expect(logged).toBeTruthy();
  expect(user.email).toEqual("admin@ecoteka.natural-solutions.eu");
});

test("wrong password", async () => {
  userEvent.type(username, "admin@ecoteka.natural-solutions.eu");
  userEvent.type(password, "wrong password");

  const { logged } = await login();
  const errorServer = await screen.findAllByText(
    translations.SignIn.errorMessageServer
  );

  expect(logged).toBeFalsy();
  expect(errorServer).toBeDefined();
});

test("invalid email format", async () => {
  userEvent.type(username, "invalid email");

  const { logged } = await login();
  const errorEmail = await screen.findAllByText(
    translations.SignIn.errorMessageEmail
  );

  expect(logged).toBeFalsy();
  expect(errorEmail);
});

test("wrong email", async () => {
  userEvent.type(username, "nouser@ecoteka.natural-solutions.eu");
  userEvent.type(password, "password");

  const { logged } = await login();
  const errorServer = await screen.findAllByText(
    translations.SignIn.errorMessageServer
  );

  expect(logged).toBeFalsy();
  expect(errorServer);
});

test("user key enter", async () => {
  fireEvent.keyDown(password, { key: "Enter", keyCode: 13 });

  expect(handleOnSubmit).toHaveBeenCalledTimes(1);
});
