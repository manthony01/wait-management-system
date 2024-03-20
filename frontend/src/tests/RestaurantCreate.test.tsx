import * as React from "react";
import "@testing-library/jest-dom";
import { setupServer } from "msw/node";
import { render, waitFor } from "@testing-library/react";
import { store } from "../store/store";
import { Provider } from "react-redux";
import { BrowserRouter as Router } from "react-router-dom";
import { handlers } from "../mocks/handlers";
import RestaurantCreatePage from "../pages/manager/RestaurantCreate";

const server = setupServer(...handlers);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

describe("Restaurant create tests", () => {
  test("Restaurant create page renders", async () => {
    const { getByTestId } = render(
      <Provider store={store}>
        <Router>
          <RestaurantCreatePage />
        </Router>
      </Provider>
    );

    await waitFor(() => {
      expect(getByTestId("restaurant-create-page")).toBeInTheDocument();
    });
  });
});
