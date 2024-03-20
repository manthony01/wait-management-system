import * as React from "react";
import "@testing-library/jest-dom";
import ArrowIcon from "../components/Icons/ArrowIcon";
import { setupServer } from "msw/node";
import { render } from "@testing-library/react";
import BellIcon from "../components/Icons/BellIcon";
import CakeIcon from "../components/Icons/CakeIcon";
import { handlers } from "../mocks/handlers";
import CartIcon from "../components/Icons/CartIcon";
import CrossCircle from "../components/Icons/CrossCircle";
import { DeleteIcon } from "../components/Icons/DeleteIcon";
import { EditIcon } from "../components/Icons/EditIcon";

const server = setupServer(...handlers);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

describe("Icon Render tests", () => {
  test("renders Bell", () => {
    const { getByTestId } = render(<BellIcon />);
    expect(getByTestId("bell-icon")).toBeInTheDocument();
  });

  test("renders Cart", () => {
    const { getByTestId } = render(<CartIcon />);
    expect(getByTestId("cart-icon")).toBeInTheDocument();
  });

  test("renders Cross", () => {
    const { getByTestId } = render(<CrossCircle />);
    expect(getByTestId("cross-circle")).toBeInTheDocument();
  });
  test("renders delete", () => {
    const { getByTestId } = render(<DeleteIcon />);
    expect(getByTestId("delete-icon")).toBeInTheDocument();
  });
  test("renders Edit", () => {
    const { getByTestId } = render(<EditIcon />);
    expect(getByTestId("edit-icon")).toBeInTheDocument();
  });

  test("renders arrow", () => {
    const { getByTestId } = render(<ArrowIcon />);
    expect(getByTestId("arrow-icon")).toBeInTheDocument();
  });

  test("renders cake", () => {
    const { getByTestId } = render(<CakeIcon />);
    expect(getByTestId("cake-icon")).toBeInTheDocument();
  });
});
