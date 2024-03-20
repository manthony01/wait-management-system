import * as React from "react";
import "@testing-library/jest-dom";
import { setupServer } from "msw/node";
import { render, waitFor } from "@testing-library/react";
import { store } from "../store/store";
import { Provider } from "react-redux";
import { BrowserRouter as Router } from "react-router-dom";
import { handlers } from "../mocks/handlers";
import { Home } from "../pages/Home";

const server = setupServer(...handlers);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

describe("Component Render Tests", () => {
  test("Home render", async () => {
    const { getByTestId } = render(
      <Provider store={store}>
        <Router>
          <Home />
        </Router>
      </Provider>
    );
    await waitFor(() => {
      expect(getByTestId("landing-text")).toBeInTheDocument();
    });
  });
});
