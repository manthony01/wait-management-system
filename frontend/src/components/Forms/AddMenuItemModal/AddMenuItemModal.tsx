import React from "react";
import ManagerAddItem from "../../../pages/manager/managerAddItem";
import { Tag } from "../../../types";

type AddMenuitemModalProps = {
  lastRank: string | undefined;
  restaurantId: number;
  categoryId: number;
  allTags: Tag[];
};

const AddMenuItemModal: React.FC<AddMenuitemModalProps> = ({
  lastRank,
  restaurantId,
  categoryId,
  allTags,
}) => {
  return (
    <>
      <button
        className="btn bg-accent hover:bg-accent-focus text-accent-content"
        onClick={() => {
          if (document) {
            (
              document.getElementById(
                `add_menu_item_modal-${categoryId}`
              ) as HTMLFormElement
            ).showModal();
          }
        }}
      >
        Add Menu Item
      </button>
      <dialog
        id={`add_menu_item_modal-${categoryId}`}
        className="modal modal-bottom sm:modal-middle"
      >
        <form method="dialog" className="modal-box">
          <ManagerAddItem
            isModal={true}
            lastRank={lastRank}
            restaurantId={restaurantId}
            categoryId={categoryId}
            allTags={allTags}
          />
        </form>
        <form method="dialog" className="modal-backdrop">
          <button />
        </form>
      </dialog>
    </>
  );
};

export default AddMenuItemModal;
