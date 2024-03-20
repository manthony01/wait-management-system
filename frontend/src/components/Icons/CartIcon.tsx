import React, { useEffect, useState } from "react";
import { TotalOrder } from "../../types";

const CartIcon: React.FC = () => {
  const getQuantity = () => {
    const totalOrder: TotalOrder = JSON.parse(
      localStorage.getItem("order") ?? "{}"
    );
    let quantity = 0;
    for (const order of Object.values(totalOrder)) {
      quantity += order.reduce((prev, curr) => prev + curr.quantity, 0);
    }
    return quantity;
  };
  const [count, setCount] = useState(getQuantity());
  useEffect(() => {
    const handleStorage = () => {
      setCount(getQuantity());
    };
    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, []);

  return (
    <div className="indicator" data-testid="cart-icon">
      {count !== 0 && (
        <span className="indicator-item badge badge-secondary p-1 text-xs">
          {count}
        </span>
      )}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth="1.5"
        stroke="currentColor"
        className="w-6 h-6"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z"
        />
      </svg>
    </div>
  );
};

export default CartIcon;
