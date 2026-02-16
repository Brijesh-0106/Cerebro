import { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { CiLock } from "react-icons/ci";
import { FaGoogle } from "react-icons/fa";
import { GiBrain } from "react-icons/gi";
import { MdOutlineAttachEmail, MdOutlinePerson } from "react-icons/md";
import { Link, useNavigate } from "react-router-dom";
import type { SignInProps } from "../Models/SignInProps";
import { Alert } from "./Alert";
import GoogleSignIn from "./GoogleSignIn";

export function SignIn() {
  const nav = useNavigate();
  const googleButtonRef = useRef<HTMLDivElement>(null);
  const [showAlert, setShowAlert] = useState(false);
  const [errorGoogle, setErrorGoogle] = useState("");

  const {
    register,
    setError,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignInProps>();

  const handleGoogleSuccess = (user: Record<string, unknown>) => {
    console.log("Signed in successfully:", user);
    // Redirect to dashboard or home
    nav("/dashboard/all-content");
  };

  const handleGoogleError = (error: string) => {
    setErrorGoogle(error);
  };

  const signin = async (data: SignInProps) => {
    if (data.passwordInput !== data.confirmPasswordInput) {
      setError("confirmPasswordInput", {
        type: "Password Validations",
        message: "Password and Confirm Password doesn't match",
      });
      return;
    }
    const res = await fetch(
      `${import.meta.env.VITE_BACKEND_URL}/v0/api/signin`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: data.userNameInput,
          email: data.emailInput,
          password: data.passwordInput,
        }),
      },
    );
    if (res.status == 200) {
      await res.json();
      setShowAlert(true);
      setTimeout(() => {
        setShowAlert(false);
        nav("/login");
      }, 1000);
    } else if (res.status == 409) {
      // alert("Temporary Closed");
      setError("emailInput", {
        type: "User Already Exist",
        message: "User with this email already exist, Please try login",
      });
      return;
    }
  };

  const handleCustomButtonClick = () => {
    const googleButton =
      googleButtonRef.current?.querySelector('div[role="button"]');
    console.log(googleButton);
    if (googleButton) {
      (googleButton as HTMLElement).click();
    }
  };

  return (
    <div className="bg-custom-gradient w-full h-screen bg-[rgb(18,18,18,1)] flex justify-center items-center">
      <span className="max-w-sm flex flex-col gap-4">
        <div className="text-white text-2xl justify-center items-center gap-3 title flex mb-8">
          {showAlert && (
            <Alert title="User Created Successfully" type="success" />
          )}
          <GiBrain size={48} color="#4f39f6" />
          Cerebro
        </div>
        {errorGoogle && <div className="error-message">{errorGoogle}</div>}
        <div className="flex justify-center">
          <button
            onClick={handleCustomButtonClick}
            className="cursor-pointer rounded justify-center bg-indigo-600 text-center text-white flex py-4 px-4 items-center gap-2"
          >
            <FaGoogle size={24} /> Sign up with Google
          </button>
          <div ref={googleButtonRef} style={{ display: "none" }}>
            <GoogleSignIn
              onSuccess={handleGoogleSuccess}
              onError={handleGoogleError}
            />
          </div>
        </div>
        <div className="text-white text-center">
          or, sign up with your email
        </div>
        <form onSubmit={handleSubmit(signin)}>
          <div className="flex flex-col">
            <div
              className={
                errors.userNameInput
                  ? "w-sm login-Input-Wrapper flex items-stretch rounded"
                  : "mb-2 w-sm login-Input-Wrapper flex items-stretch rounded"
              }
            >
              <div className="pl-2 flex items-center">
                <MdOutlinePerson size={20} color="#a9a9a9" />
              </div>
              <input
                {...register("userNameInput", {
                  required: {
                    value: true,
                    message: "User name is Required",
                  },
                  minLength: {
                    value: 3,
                    message: "User name must be at least 3 characters",
                  },
                })}
                placeholder="UserName..."
                className="focus:outline-none text-white login-inputs w-sm rounded py-2 px-2"
                type="text"
              />
            </div>
            {errors.userNameInput?.message && (
              <span className="text-red-600 mb-1">
                {errors.userNameInput.message.toString()}
              </span>
            )}
            <div
              className={
                errors.emailInput
                  ? "w-sm login-Input-Wrapper flex items-stretch rounded"
                  : "mb-2 w-sm login-Input-Wrapper flex items-stretch rounded"
              }
            >
              <div className="pl-2 flex items-center">
                <MdOutlineAttachEmail size={20} color="#a9a9a9" />
              </div>
              <input
                placeholder="Email..."
                type="text"
                {...register("emailInput", {
                  required: {
                    value: true,
                    message: "Email is Required",
                  },
                  pattern: {
                    value: /^\S+@\S+$/i,
                    message: "Email is not valid",
                  },
                })}
                className="focus:outline-none text-white rounded w-sm login-inputs  py-2 px-2"
              />
            </div>
            {errors.emailInput?.message && (
              <p className="text-red-600 mb-1">
                {errors.emailInput.message.toString()}
              </p>
            )}
            <div
              className={
                errors.passwordInput
                  ? "w-sm login-Input-Wrapper flex items-stretch rounded"
                  : "mb-2 w-sm login-Input-Wrapper flex items-stretch rounded"
              }
            >
              <div className="pl-2 flex items-center">
                <CiLock size={20} color="#a9a9a9" />
              </div>
              <input
                type="password"
                {...register("passwordInput", {
                  required: {
                    value: true,
                    message: "Password is Required",
                  },
                  minLength: {
                    value: 8,
                    message: "Password must be at least 8 characters",
                  },
                })}
                placeholder="Password..."
                className="focus:outline-none rounded text-white w-sm login-inputs  py-2 px-2"
              />
            </div>
            {errors.passwordInput?.message && (
              <p className="text-red-600 mb-1">
                {errors.passwordInput.message.toString()}
              </p>
            )}

            <div
              className={
                errors.confirmPasswordInput
                  ? "w-sm login-Input-Wrapper flex items-stretch rounded"
                  : "mb-2 w-sm login-Input-Wrapper flex items-stretch rounded"
              }
            >
              <div className="pl-2 flex items-center">
                <CiLock size={20} color="#a9a9a9" />
              </div>
              <input
                type="text"
                placeholder="Confirm Password..."
                className="focus:outline-none rounded text-white w-sm login-inputs  py-2 px-2"
                {...register("confirmPasswordInput", {
                  required: {
                    value: true,
                    message: "Confirm Password is Required",
                  },
                  minLength: {
                    value: 8,
                    message: "Confirm Password must be at least 8 characters",
                  },
                })}
              />
            </div>
            {errors.confirmPasswordInput?.message && (
              <p className="text-red-600 mb-1">
                {errors.confirmPasswordInput.message.toString()}
              </p>
            )}
          </div>
          <div className="flex justify-center mt-2">
            <button
              type="submit"
              disabled={isSubmitting}
              // onClick={() => signin()}
              className="cursor-pointer rounded text-md w-sm justify-center bg-indigo-600 text-center text-white py-2 px-4 flex items-center gap-2"
            >
              Continue
            </button>
          </div>
        </form>
        <div className="text-white">
          Already have an account?{" "}
          <Link to={"/login"} className="text-blue-500">
            Login
          </Link>
        </div>
      </span>
    </div>
  );
}
