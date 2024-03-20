import React, { useState } from "react";
import TextInputComponent from "../../components/InputComponents/TextInputComponent";
import {
  useAddMenuItemMutation,
  useUploadFileMutation,
} from "../../services/manager";
import { LexoRank } from "lexorank";
import ListInputComponent from "../../components/InputComponents/ListInputComponent";
import TagListInputComponent from "../../components/InputComponents/TagListInputComponent";
import { Tag } from "../../types";

interface MyComponentProps {
  isModal: boolean;
  lastRank: string | undefined;
  restaurantId: number;
  categoryId: number;
  allTags: Tag[];
}

const ManagerAddItem: React.FC<MyComponentProps> = ({
  isModal,
  lastRank,
  restaurantId,
  categoryId,
  allTags,
}) => {
  const [image, setImage] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [cost, setCost] = useState<number>(0);
  const [tags, setTags] = useState<Tag[]>([]);

  const [ingredients, setIngredients] = useState<string[]>([]);

  const [addMenuItem] = useAddMenuItemMutation();
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

  const addDietaryTag = (tag: Tag | null) => {
    if (!tag) {
      return;
    }
    if (tags.find((t) => t.id === tag.id)) {
      return;
    }
    setTags(tags.concat(tag));
  };

  const removeDietaryTag = (id: number) => {
    const idx = tags.findIndex((t) => t.id === id);
    const clone = [...tags];
    clone.splice(idx, 1);
    setTags(clone);
  };

  const clearForm = () => {
    setImage(null);
    setTitle("");
    setDescription("");
    setCost(0);
    setIngredients([]);
    setTags([]);
    setImageFile(null);
  };

  const handleSubmit = () => {
    if (!imageFile) {
      return;
    }
    fetch(`http://localhost:8000/presignedPutUrl`)
      .then((response) => {
        return response.json().then(({ url, key }) => {
          uploadFile({
            file: imageFile,
            url: `${url.substring(0, 7)}localhost:8080/minio${url.substring(
              17
            )}`,
          })
            .unwrap()
            .then(() => {
              addMenuItem({
                title,
                description,
                categoryid: categoryId,
                cost,
                imagepath: key,
                restaurantid: restaurantId,
                ingredients: JSON.stringify(ingredients),
                tags: tags.map((t) => t.id),
                orderindex: lastRank
                  ? LexoRank.parse(lastRank).genNext().toString()
                  : LexoRank.middle().toString(),
              }).catch((err) => {
                console.error(err);
              });
              clearForm();
            });
        });
      })
      .catch((err) => {
        console.error(err);
      });
  };

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
        onClick={() => clearForm()}
      >
        Cancel
      </button>
    </>
  );
  return (
    <div className="bg-base-100">
      <h1 className="text-2xl font-bold mb-4 text-light-textPrimary">
        Add new menu item
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
        <TagListInputComponent
          data={tags}
          options={allTags}
          label={"Dietary Tags"}
          placeholder={"Enter Dietary Option"}
          addValue={addDietaryTag}
          removeValue={removeDietaryTag}
        />
        <div className="flex">
          <div>
            <label className="label">
              <span className="label-text text-light-textSecondary">Image</span>
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
      {isModal ? (
        <div className="modal-action">{renderButtons()}</div>
      ) : (
        renderButtons()
      )}
    </div>
  );
};

export default ManagerAddItem;
