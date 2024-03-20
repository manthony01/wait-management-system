import React from "react";
import { MenuItem, Order, Tag, TotalOrder } from "../../../types";
import { getObjectPath } from "../../../utils/utilFunctions";
import PlusCircle from "../../Icons/PlusCircle";
import MinusCircle from "../../Icons/MinusCircle";

type OrderMenuItemModalProps = {
  menuItem: MenuItem;
  restaurantId: number;
};

const OrderMenuItemModal: React.FC<OrderMenuItemModalProps> = ({
  menuItem,
  restaurantId,
}) => {
  const dialogRef = React.useRef<HTMLDialogElement | null>(null);
  const [quantity, setQuantity] = React.useState(1);

  const addQty = () => setQuantity(quantity + 1);
  const reduceQty = () => quantity > 1 && setQuantity(quantity - 1);

  const addToOrder = () => {
    const totalOrder = localStorage.getItem("order");
    const order: TotalOrder = totalOrder ? JSON.parse(totalOrder) : {};
    if (!(restaurantId in order)) {
      order[restaurantId] = [{ menuitemid: menuItem.id, quantity }];
    } else {
      const itemExists = order[restaurantId].findIndex((o: Order) => {
        return o.menuitemid === menuItem.id;
      });

      if (itemExists >= 0) {
        order[restaurantId][itemExists].quantity += quantity;
      } else {
        order[restaurantId].push({ menuitemid: menuItem.id, quantity });
      }
    }

    localStorage.setItem("order", JSON.stringify(order));
    window.dispatchEvent(new Event("storage"));
    setQuantity(1);
  };
  React.useEffect(() => {
    const dialog = dialogRef.current;
    if (dialog) {
      dialog.addEventListener("close", () => {
        dialog.removeAttribute("open");
      });
    }
  }, []);

  return (
    <>
      <dialog
        id={`menu-item-modal-${menuItem.id}`}
        className="modal modal-bottom sm:modal-middle"
      >
        <div className="modal-box">
          <div>
            <p className="text-2xl font-bold">{menuItem.title}</p>
            <p className="my-4">{menuItem.description}</p>
          </div>
          <div>
            <img
              className="w-2/3 object-cover mx-auto"
              src={getObjectPath(menuItem.imagepath)}
              alt={menuItem.title}
            />
          </div>
          <div>
            <div className="text-xl font-medium mt-4">Ingredients</div>
            <ul className="pl-5 list-['\00BB']">
              {JSON.parse(menuItem.ingredients).map((ingredient: string) => (
                <li className="pl-2" key={ingredient}>
                  {ingredient}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <div className="text-xl font-medium mt-4">Dietary Tags</div>
            <div className="flex gap-2 flex-wrap">
              {menuItem.tags.map((tag: Tag) => (
                <div
                  key={`tag-${tag.id}`}
                  className="badge badge-outline badge-info hover:text-black select-none px-3"
                  style={{ color: tag.colour, borderColor: tag.colour }}
                >
                  {tag.tagname}
                </div>
              ))}
            </div>
          </div>
          <div className="flex flex-row justify-between mt-2">
            <div className="flex flex-row select-none">
              <button
                onClick={reduceQty}
                className={`outline-none border-none ${
                  quantity === 1
                    ? "text-gray-400 cursor-not-allowed"
                    : "text-current cursor-pointer"
                }`}
              >
                <MinusCircle />
              </button>
              <div className="mx-7 select-none my-auto">{quantity}</div>
              <button onClick={addQty}>
                <PlusCircle />
              </button>
            </div>
            <form method="dialog">
              <button
                className="btn btn-accent rounded-full text-accent-content select-none focus:outline-none"
                onClick={addToOrder}
              >
                {`Add to order - $${(menuItem.cost * quantity).toFixed(2)}`}
              </button>
            </form>
          </div>
        </div>
        <form method="dialog" className="modal-backdrop">
          <button />
        </form>
      </dialog>
    </>
  );
};

export default OrderMenuItemModal;
