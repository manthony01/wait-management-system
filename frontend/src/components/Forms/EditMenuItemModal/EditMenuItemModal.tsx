import React, { useState } from "react";

import {
  useUpdateMenuItemMutation,
  useUploadFileMutation,
} from "../../../services/manager";
import TextInputComponent from "../../InputComponents/TextInputComponent";
import ListInputComponent from "../../InputComponents/ListInputComponent";
import { MenuItem } from "../../../types";
import { getObjectPath } from "../../../utils/utilFunctions";

interface EditMenuItemProps {
  menuItem: MenuItem;
  restaurantId: number;
}

const EditMenuItemModal: React.FC<EditMenuItemProps> = ({
  menuItem,
  restaurantId,
}) => {
  const [image, setImage] = useState<string | null>(
    getObjectPath(menuItem.imagepath)
  );
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [title, setTitle] = useState<string>(menuItem.title);
  const [description, setDescription] = useState<string>(menuItem.description);
  const [cost, setCost] = useState<number>(menuItem.cost);

  const [ingredients, setIngredients] = useState<string[]>(
    JSON.parse(menuItem.ingredients)
  );

  const [updateMenuItem] = useUpdateMenuItemMutation();
  const [uploadFile] = useUploadFileMutation();

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === "string") {
          setImage(reader.result);
        }
      };
      reader.readAsDataURL(e.target.files[0]);
      setImageFile(e.target.files[0]);
    }
  };
  const addIngredient = (ingredient: string) => {
    setIngredients(ingredients.concat(ingredient));
  };

  const removeIngredient = (idx: number) => {
    const clone = [...ingredients];
    clone.splice(idx, 1);
    setIngredients(clone);
  };

  const handleClose = () => {
    const modal = document.getElementById(
      `menu-edit-modal-${menuItem.id}`
    ) as HTMLDialogElement;
    if (modal && modal.hasAttribute("open")) {
      modal.close();
    }
    setTitle(menuItem.title);
    setDescription(menuItem.description);
    setCost(menuItem.cost);
    setIngredients(JSON.parse(menuItem.ingredients));
  };

  const handleSubmit = () => {
    if (!imageFile) {
      updateMenuItem({
        id: menuItem.id,
        title,
        description,
        categoryid: menuItem.categoryid,
        cost,
        restaurantid: restaurantId,
        ingredients: JSON.stringify(ingredients),
      });
    } else {
      fetch(`http://localhost:8000/presignedPutUrl`).then((response) => {
        return response.json().then(({ url, key }) => {
          return uploadFile({
            file: imageFile,
            url: `${url.substring(0, 7)}localhost:8080/minio${url.substring(
              17
            )}`,
          })
            .unwrap()
            .then(() => {
              return updateMenuItem({
                id: menuItem.id,
                title,
                description,
                categoryid: menuItem.categoryid,
                cost,
                imagepath: key,
                restaurantid: restaurantId,
                ingredients: JSON.stringify(ingredients),
              }).catch((err) => {
                console.error(err);
              });
            });
        });
      });
    }
    const modal = document.getElementById(
      `menu-edit-modal-${menuItem.id}`
    ) as HTMLDialogElement;
    if (modal && modal.hasAttribute("open")) {
      modal.close();
    }
  };
  const dialogRef = React.useRef<HTMLDialogElement | null>(null);

  React.useEffect(() => {
    const dialog = dialogRef.current;
    if (dialog) {
      dialog.addEventListener("close", () => {
        dialog.removeAttribute("open");
      });
    }
  }, []);

  const renderButtons = () => (
    <>
      <button
        className="btn bg-accent text-accent-content"
        onClick={() => handleSubmit()}
      >
        Submit
      </button>
      <button
        className="btn bg-error text-error-content"
        onClick={() => handleClose()}
      >
        Cancel
      </button>
    </>
  );

  return (
    <dialog
      id={`menu-edit-modal-${menuItem.id}`}
      className="modal modal-bottom sm:modal-middle"
    >
      <div className="modal-box">
        <h1 className="text-2xl font-bold mb-4 text-light-textPrimary">
          Edit menu item
        </h1>
        <form className="space-y-4">
          <TextInputComponent
            label="Name"
            type="text"
            value={title}
            placeholder="Name"
            handleChange={(e) => setTitle(e.target.value)}
          />
          <TextInputComponent
            label="Description"
            type="textarea"
            value={description}
            placeholder="Description"
            handleChange={(e) => setDescription(e.target.value)}
          />
          <ListInputComponent
            data={ingredients.map((ingredient) => ingredient)}
            label="Ingredients"
            type="text"
            placeholder="Beef"
            addValue={addIngredient}
            removeValue={removeIngredient}
          />
          <div className="flex">
            <div>
              <label className="label">
                <span className="label-text text-light-textSecondary">
                  Image
                </span>
              </label>
              <input
                type="file"
                className="block w-4/7 shadow-sm text-sm focus:z-10
                    file:border-0
                    file:rounded-md
                    file:bg-light-accent3
                    file:text-white
                    text-light-textSecondary
                    file:mr-4
                    file:py-3 file:px-4
                  "
                onChange={handleImageChange}
              />
            </div>
            <div>
              {image && (
                <img
                  src={image}
                  alt="Preview"
                  className="w-36 h-36 mt-2 object-cover rounded hidden sm:block"
                />
              )}
            </div>
          </div>
          <div className="w-full flex">
            <TextInputComponent
              label="Cost"
              type="number"
              value={cost}
              placeholder="Cost"
              handleChange={(e) => setCost(parseFloat(e.target.value))}
            />
          </div>
        </form>
        <div className="modal-action">{renderButtons()}</div>
      </div>
    </dialog>
  );
};

export default EditMenuItemModal;
