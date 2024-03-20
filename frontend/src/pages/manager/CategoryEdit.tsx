import React from "react";
import { MenuItem, Tag } from "../../types";
import { Draggable, Droppable } from "react-beautiful-dnd";
import AddMenuItemModal from "../../components/Forms/AddMenuItemModal/AddMenuItemModal";
import {
  useDeleteCategoryMutation,
  useDeleteMenuItemMutation,
} from "../../services/manager";
import MenuItemCard from "../../components/menuItemCard/menuItemCard";
import { toast } from "react-toastify";
import { PythonError } from "../../types";
import EditMenuItemModal from "../../components/Forms/EditMenuItemModal/EditMenuItemModal";

type CategoryEditProps = {
  restaurantId: number;
  categoryId: number;
  droppableId: string;
  items: MenuItem[];
  allTags: Tag[];
};

const CategoryEdit: React.FC<CategoryEditProps> = ({
  restaurantId,
  categoryId,
  droppableId,
  items,
  allTags,
}: CategoryEditProps) => {
  const lastRank =
    items.length > 0 ? items[items.length - 1].orderindex : undefined;
  const [deleteMenuItem] = useDeleteMenuItemMutation();
  const [deleteCategory] = useDeleteCategoryMutation();

  const handleDeleteMenuItem = async (id: number) => {
    try {
      const response = await deleteMenuItem(id).unwrap();
      toast(`Successfully deleted menu item ${response.title}`, {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
    } catch (e) {
      toast.error(`Order items still linked to menu item ${id}`, {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
    }
  };

  const handleDeleteCategory = async (id: number) => {
    try {
      const response = await deleteCategory(id).unwrap();
      toast(`Successfully deleted category ${response.name}`, {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
    } catch (error: unknown) {
      toast.error((error as PythonError).data.detail, {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
    }
  };

  return (
    <>
      <Droppable droppableId={droppableId} type="droppable-item">
        {(provided) => (
          <div ref={provided.innerRef} className="flex flex-col gap-y-5 p-5">
            {items.map((item, index) => (
              <React.Fragment key={`item-${item.id}`}>
                <Draggable draggableId={`item-${item.id}`} index={index}>
                  {(provided) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      className="flex"
                    >
                      <MenuItemCard
                        title={item.title}
                        description={item.description}
                        price={item.cost}
                        imageUrl={item.imagepath}
                        onClick={() => {
                          const modal = document.getElementById(
                            `menu-edit-modal-${item.id}`
                          ) as HTMLDialogElement;
                          if (modal && !modal.hasAttribute("open")) {
                            modal.showModal();
                          }
                        }}
                      />
                      <button
                        className="btn bg-error text-error-content my-auto ml-5"
                        onClick={() => handleDeleteMenuItem(item.id)}
                      >
                        Delete
                      </button>
                    </div>
                  )}
                </Draggable>
                <EditMenuItemModal
                  menuItem={item}
                  restaurantId={parseInt(restaurantId.toString() ?? "0", 10)}
                />
              </React.Fragment>
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
      {items.length !== 0 ? (
        <div className="invisible p-5 my-5">Placeholder</div>
      ) : (
        <div className="p-5 my-5">No items in this category </div>
      )}
      <AddMenuItemModal
        restaurantId={restaurantId}
        categoryId={categoryId}
        lastRank={lastRank}
        allTags={allTags}
      />
      <button
        className="btn btn-xs sm:btn-sm md:btn-md ml-5 btn-error text-error-content"
        onClick={() => handleDeleteCategory(categoryId)}
      >
        Delete Category
      </button>
    </>
  );
};

export default CategoryEdit;
