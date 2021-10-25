import { render } from "@/__tests__/utils/test-utils";
import { fireEvent, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import pages from "@/public/locales/fr/pages.json";
import common from "@/public/locales/fr/common.json";
import router from "next/router";
import ForgotPage from "@/pages/forgot";

let page, email, button;
const user = "admin@ecoteka.natural-solutions.eu";

beforeEach(() => {
  router.push("/forgot");

  page = render(<ForgotPage />);
  email = page.getByTestId("forgot-page-email");
  button = page.getByText(pages.Forgot.EmailCard.sendButton);

  expect(email).toBeDefined();
  expect(button).toBeDefined();

  userEvent.type(email, user);
});

test("send reset link", async () => {
  fireEvent.click(button);

  await waitFor(() =>
    expect(page.getByText(user, { exact: false })).toBeInTheDocument()
  );

  const sentCard = page.getByText(pages.Forgot.SentCard.description, {
    exact: false,
  });

  expect(sentCard).toBeDefined();

  const loginButton = page.getByText(pages.Forgot.SentCard.buttonOnLogin);

  fireEvent.click(loginButton);

  expect(router).toMatchObject({
    pathname: "/signin",
  });
});

test("email keydown", async () => {
  fireEvent.keyDown(email, { key: "Enter", keyCode: 13 });

  await waitFor(() =>
    expect(page.getByText(user, { exact: false })).toBeInTheDocument()
  );
});

test("wrong email", async () => {
  userEvent.type(email, "wrong email");
  fireEvent.keyDown(email, { key: "Enter", keyCode: 13 });

  await waitFor(() =>
    expect(page.getByText(common.errors.email)).toBeDefined()
  );
});
