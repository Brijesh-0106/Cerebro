import { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { CiLock } from "react-icons/ci";
import { FaGoogle } from "react-icons/fa";
import { GiBrain } from "react-icons/gi";
import { MdOutlineAttachEmail } from "react-icons/md";
import { Link, useLocation, useNavigate } from "react-router-dom";
import type { LoginProps } from "../Models/SignInProps";
import GoogleSignIn from "./GoogleSignIn";

export function Login() {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<LoginProps>();

  const googleButtonRef = useRef<HTMLDivElement>(null);
  const nav = useNavigate();
  const loc = useLocation();
  const [disableBtn, setDisableBtn] = useState(false);
  const [errorGoogle, setErrorGoogle] = useState("");
  if (loc.state) {
    const landEmail = (loc.state as { landEmail: string }).landEmail;
    setValue("emailInput", landEmail); // Pre-fill the email input with the value from LandingPage
    window.history.replaceState({}, "");
  }

  const handleGoogleSuccess = (user: Record<string, unknown>) => {
    console.log("Signed in successfully:", user);
    // Redirect to dashboard or home
    nav("/dashboard/all-content");
  };

  const handleGoogleError = (error: string) => {
    setErrorGoogle(error);
  };

  const login = async (credentials: LoginProps) => {
    setDisableBtn(true);
    const data = await fetch(
      `${import.meta.env.VITE_BACKEND_URL}/v0/api/login`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          password: credentials.passwordInput,
          email: credentials.emailInput,
        }),
      },
    );
    if (data.status == 200) {
      const res = await data.json();
      localStorage.setItem("userName", res.name);
      localStorage.setItem("token", res.token);
      setDisableBtn(false);
      nav("/dashboard/all-content");
    } else if (data.status == 500) {
      const res = await data.json();
      setErrorGoogle(res.error);
      setDisableBtn(false);
      return;
    }
    setDisableBtn(false);
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
        <Link
          to="/"
          className="text-white text-3xl justify-center items-center gap-1 title flex mb-8"
        >
          <GiBrain size={48} color="#4f39f6" />
          <span
            className="text-4xl font-bold text-indigo-600"
            style={{
              fontFamily: "'Lobster Two', cursive",
              fontStyle: "italic",
              letterSpacing: "0.08em",
            }}
          >
            CereBro
          </span>
        </Link>
        {errorGoogle && <div className="error-message">{errorGoogle}</div>}
        <div className="flex justify-center">
          <button
            onClick={handleCustomButtonClick}
            className="cursor-pointer rounded justify-center bg-indigo-600 text-center text-white py-4 px-4 flex items-center gap-2"
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
        <form onSubmit={handleSubmit(login)}>
          <div className="flex flex-col">
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
                placeholder="Email..."
                type="text"
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
                onPaste={(e) => e.preventDefault()}
                onCopy={(e) => e.preventDefault()}
                onCut={(e) => e.preventDefault()}
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
                type="password"
                placeholder="Password..."
                className="focus:outline-none rounded text-white w-sm login-inputs  py-2 px-2 
                "
              />
            </div>
            {errors.passwordInput?.message && (
              <p className="text-red-600 mb-1">
                {errors.passwordInput.message.toString()}
              </p>
            )}
          </div>
          <div className="flex justify-center mt-2">
            {!disableBtn ? (
              <button
                type="submit"
                className="rounded cursor-pointer text-md w-sm justify-center bg-indigo-600 text-center text-white py-2 px-4 flex items-center gap-2"
              >
                Continue
              </button>
            ) : (
              <button
                disabled={disableBtn}
                className="rounded cursor-pointer text-md w-sm justify-center bg-indigo-900 text-center text-gray-400 py-2 px-4 flex items-center gap-2"
              >
                Processing
              </button>
            )}
          </div>
        </form>
        <div className="text-white">
          Don't have an account yet?{" "}
          <Link to={"/signin"} className="text-blue-500">
            Sign up
          </Link>{" "}
        </div>
      </span>
    </div>
  );
}
