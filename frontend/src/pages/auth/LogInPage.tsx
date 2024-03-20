import React, { useState } from "react";
import TextInputComponent from "../../components/InputComponents/TextInputComponent";

import { Link, useNavigate } from "react-router-dom";
import { useLoginMutation } from "../../services/auth";
import { toast } from "react-toastify";
import { PythonError } from "../../types";
import { useDispatch } from "react-redux";
import { setCredentials } from "../../slices/auth";

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [login] = useLoginMutation();
  const dispatch = useDispatch();

  const navigate = useNavigate();

  const clearForm = () => {
    setEmail("");
    setPassword("");
  };

  const handleSubmit = async () => {
    try {
      const { access_token, user } = await login({
        username: email,
        password: password,
      }).unwrap();

      dispatch(setCredentials({ user, token: access_token }));

      clearForm();
      navigate(`/`);
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
      className="flex flex-col items-center justify-center w-11/12 md:w-4/5 lg:w-3/5 mx-auto pt-12 h-[calc(100vh-50px)]"
      data-testid="login-page"
    >
      <form className="space-y-4 w-full sm:w-3/4 md:w-1/2 mx-auto my-auto shadow-2xl p-10 rounded-2xl">
        <h1 className="text-2xl text-center font-semibold">
          Sign in to get started
        </h1>
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
        <button
          type="button"
          className="btn btn-primary text-primary hover:text-primary-content w-full"
          onClick={handleSubmit}
        >
          Login
        </button>
        <div className="inline-block text-sm">
          <span className="">Not a member? </span>
          <Link to="/auth/signup" className="text-info">
            Signup
          </Link>
        </div>
      </form>
    </div>
  );
};

export default LoginPage;
