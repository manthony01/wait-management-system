import * as React from "react";
import "@testing-library/jest-dom";
import { setupServer } from "msw/node";
import { render, waitFor } from "@testing-library/react";
import { store } from "../store/store";
import { Provider } from "react-redux";
import { BrowserRouter as Router } from "react-router-dom";
import { handlers } from "../mocks/handlers";
import LoginPage from "../pages/auth/LogInPage";
import SignUpPage from "../pages/auth/SignUpPage";

const server = setupServer(...handlers);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

describe("Component Render Tests", () => {
  test("Login page render", async () => {
    const { getByTestId } = render(
      <Provider store={store}>
        <Router>
          <LoginPage />
        </Router>
      </Provider>
    );

    await waitFor(() => {
      expect(getByTestId("login-page")).toBeInTheDocument();
    });
  });

  test("Signup page render", async () => {
    const { getByTestId } = render(
      <Provider store={store}>
        <Router>
          <SignUpPage />
        </Router>
      </Provider>
    );

    await waitFor(() => {
      expect(getByTestId("sign-up-page")).toBeInTheDocument();
    });
  });
});
