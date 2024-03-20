import React, { useState } from "react";
import TextInputComponent from "../../components/InputComponents/TextInputComponent";

import { useNavigate } from "react-router-dom";
import { useUploadFileMutation } from "../../services/manager";
import { useCreateAccountMutation } from "../../services/auth";
import { PythonError } from "../../types";
import { toast } from "react-toastify";
import { raiseNotification } from "../../utils/utilFunctions";

// need name, email, password, confirm password, image, type of user?,

const SignUpPage: React.FC = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [password2, setPassword2] = useState("");
  const [image, setImage] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [uploadFile] = useUploadFileMutation();
  const [createAccount] = useCreateAccountMutation();

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

  const navigate = useNavigate();

  const clearForm = () => {
    setFirstName("");
    setLastName("");
    setEmail("");
    setPassword("");
    setPassword2("");
    setImage(null);
    setImageFile(null);
  };

  const handleSubmit = async () => {
    try {
      if (!imageFile || password !== password2) {
        throw {
          data: { detail: "Please input a valid image and matching password" },
        } as PythonError;
      }
      const presignedUrl = await fetch(`http://localhost:8000/presignedPutUrl`);
      const { url, key } = await presignedUrl.json();
      await uploadFile({
        file: imageFile,
        url: `${url.substring(0, 7)}localhost:8080/minio${url.substring(17)}`,
      }).unwrap();
      const account = await createAccount({
        firstname: firstName,
        lastname: lastName,
        email,
        password,
        imagepath: key,
      }).unwrap();
      clearForm();
      navigate(`/auth/login`);
      raiseNotification(`Successfully created account - ${account.email}`);
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
    <div
      className="flex flex-col items-center justify-center w-11/12 md:w-4/5 lg:w-3/5 mx-auto min-h-[calc(100vh-50px)] p-16"
      data-testid="sign-up-page"
    >
      <form className="space-y-4 w-full sm:w-3/4 mx-auto my-auto shadow-2xl p-10 rounded-2xl">
        <h1 className="text-2xl text-center font-semibold">Join us today.</h1>
        <TextInputComponent
          label={"First name"}
          type={"text"}
          value={firstName}
          handleChange={(e) => setFirstName(e.target.value)}
          placeholder={"First name"}
        />
        <TextInputComponent
          label={"Last name"}
          type={"text"}
          value={lastName}
          handleChange={(e) => setLastName(e.target.value)}
          placeholder={"Last name"}
        />
        <TextInputComponent
          label={"Email"}
          type={"email"}
          value={email}
          handleChange={(e) => setEmail(e.target.value)}
          placeholder={"Email"}
        />
        <TextInputComponent
          label={"Password"}
          type={"password"}
          value={password}
          handleChange={(e) => setPassword(e.target.value)}
          placeholder={"Password"}
        />
        <TextInputComponent
          label={"Confirm password"}
          type={"password"}
          value={password2}
          handleChange={(e) => setPassword2(e.target.value)}
          placeholder={"Confirm password"}
          isInvalid={password !== password2}
          errorStyle="input-error"
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
          className="btn btn-primary text-primary hover:text-primary-content w-full"
          onClick={handleSubmit}
        >
          Register
        </button>
      </form>
    </div>
  );
};

export default SignUpPage;
