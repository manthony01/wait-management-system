import React, { useState } from "react";
import PageContainer from "../../containers/pageContainer";
import SectionContainer from "../../containers/sectionContainer";
import TextInputComponent from "../../components/InputComponents/TextInputComponent";
import TextAreaInputComponent from "../../components/InputComponents/TextAreaInputComponent";
import {
  useAddRestaurantMutation,
  useAddRestaurantTableMutation,
  useUploadFileMutation,
} from "../../services/manager";
import { useNavigate } from "react-router-dom";
import ListInputComponent from "../../components/InputComponents/ListInputComponent";

const RestaurantCreatePage: React.FC = () => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  const [image, setImage] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);

  const [tableNumbers, setTableNumbers] = useState<number[]>([]);

  const [uploadFile] = useUploadFileMutation();
  const [addRestaurant] = useAddRestaurantMutation();
  const [addRestaurantTable] = useAddRestaurantTableMutation();

  const navigate = useNavigate();

  const addTableNumber = (value: string) => {
    setTableNumbers(tableNumbers.concat(parseInt(value, 10)));
  };

  const removeTableNumber = (idx: number) => {
    const clone = [...tableNumbers];
    clone.splice(idx, 1);
    setTableNumbers(clone);
  };

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

  const clearForm = () => {
    setName("");
    setDescription("");
    setImage(null);
    setImageFile(null);
  };

  const handleSubmit = async () => {
    if (!imageFile) {
      return;
    }
    const presignedUrl = await fetch(`http://localhost:8000/presignedPutUrl`);
    const { url, key } = await presignedUrl.json();
    await uploadFile({
      file: imageFile,
      url: `${url.substring(0, 7)}localhost:8080/minio${url.substring(17)}`,
    }).unwrap();
    const restaurant = await addRestaurant({
      name,
      comment: description,
      imagepath: key,
    }).unwrap();
    tableNumbers.forEach(
      async (tableNumber) =>
        await addRestaurantTable({
          restaurantid: restaurant.id,
          tableid: tableNumber,
        })
    );
    clearForm();
    navigate(`/manager/restaurant/menu/${restaurant.id}`);
  };

  return (
    <PageContainer>
      <SectionContainer>
        <h1
          className="text-2xl text-center font-semibold"
          data-testid="restaurant-create-page"
        >
          Register your Restaurant
        </h1>
      </SectionContainer>
      <SectionContainer>
        <form className="space-y-4 w-full sm:w-3/4 md:w-1/2 mx-auto">
          <TextInputComponent
            label={"Name"}
            type={"text"}
            value={name}
            handleChange={(e) => setName(e.target.value)}
            placeholder={"Burgerpoint"}
          />
          <TextAreaInputComponent
            label={"Description"}
            placeholder={"An elegant burger joint specializing in beef"}
            value={description}
            handleChange={(e) => setDescription(e.target.value)}
          />
          <ListInputComponent
            data={tableNumbers.map((number) => number.toString())}
            label="Table Numbers"
            placeholder="1"
            type="number"
            addValue={addTableNumber}
            removeValue={removeTableNumber}
          />
          <div>
            <label className="label">
              <span className="label-text text-light-textSecondary">Image</span>
            </label>
            <input
              type="file"
              className="block w-4/7 shadow-sm text-sm focus:z-10
                  file:border-0
                  file:rounded-md
                  file:bg-primary
                  file:text-primary-content
                  file:hover:bg-primary-focus
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
                className="mt-2 object-cover rounded hidden sm:block"
              />
            )}
          </div>
          <button
            type="button"
            className="btn btn-primary text-primary hover:text-primary-content"
            onClick={handleSubmit}
          >
            Register
          </button>
        </form>
      </SectionContainer>
    </PageContainer>
  );
};

export default RestaurantCreatePage;
