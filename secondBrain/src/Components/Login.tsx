import { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { CiLock } from "react-icons/ci";
import { FaGoogle } from "react-icons/fa";
import { HiArrowLeft } from "react-icons/hi2";
import { MdOutlineAttachEmail } from "react-icons/md";
import { Link, useLocation, useNavigate } from "react-router-dom";
import type { LoginProps } from "../Models/SignInProps";
import GoogleSignIn from "./GoogleSignIn";
import { ThemeToggle } from "./ThemeToggle";

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
    if (googleButton) {
      (googleButton as HTMLElement).click();
    }
  };

  return (
    <div className="w-full min-h-screen bg-canvas-grid text-zinc-900 dark:text-zinc-100 flex flex-col justify-center items-center p-4 transition-colors duration-200 relative overflow-hidden">
      {/* Ambient background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-gradient-to-tr from-indigo-500/10 via-purple-500/10 to-transparent blur-3xl pointer-events-none -z-10 rounded-full" />

      {/* Top action bar: Back to Home + Theme Toggle */}
      <div className="w-full max-w-md flex items-center justify-between mb-4 px-1">
        <Link
          to="/"
          className="inline-flex items-center gap-1.5 text-xs sm:text-sm text-zinc-500 hover:text-indigo-600 dark:text-zinc-400 dark:hover:text-indigo-400 font-medium transition-colors"
        >
          <HiArrowLeft size={16} />
          <span>Back to Home</span>
        </Link>
        <ThemeToggle />
      </div>

      {/* Main Auth Card */}
      <div className="w-full max-w-md bg-white/85 dark:bg-[#12141e]/85 backdrop-blur-xl border border-zinc-200/90 dark:border-zinc-800/90 shadow-2xl shadow-indigo-500/5 dark:shadow-black/70 rounded-3xl p-6 sm:p-8 flex flex-col">
        {/* Brand Header */}
        <Link
          to="/"
          className="flex flex-col items-center justify-center gap-1 text-center mb-6 group"
        >
          <img
            src="/Assets/isolated_brain.png"
            className="w-14 h-14 object-contain group-hover:scale-105 transition-transform"
            alt="CereBro Logo"
          />
          <span className="great-vibes font-semibold font-[Courgette] text-3xl text-primary mt-1">
            CereBro
          </span>
          <p className="text-xs text-zinc-500 dark:text-zinc-400">
            Welcome back! Sign in to access your knowledge vault
          </p>
        </Link>

        {errorGoogle && <div className="error-message mb-4">{errorGoogle}</div>}

        {/* Google Sign In */}
        <button
          onClick={handleCustomButtonClick}
          className="w-full cursor-pointer text-sm font-semibold rounded-xl justify-center bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white flex py-3 px-4 items-center gap-3 transition-all duration-200 shadow-md shadow-indigo-600/25 hover:shadow-lg hover:shadow-indigo-600/35 hover:-translate-y-0.5 active:translate-y-0"
        >
          <FaGoogle size={18} /> Sign in with Google
        </button>
        <div ref={googleButtonRef} style={{ display: "none" }}>
          <GoogleSignIn
            onSuccess={handleGoogleSuccess}
            onError={handleGoogleError}
          />
        </div>

        {/* Divider */}
        <div className="relative flex items-center justify-center my-4 w-full">
          <div className="w-full border-t border-zinc-200 dark:border-zinc-800" />
          <span className="absolute px-3 bg-white/95 dark:bg-[#12141e] text-[11px] font-medium uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
            or continue with email
          </span>
        </div>

        {/* Email/Password Form */}
        <form onSubmit={handleSubmit(login)} className="flex flex-col gap-3">
          {/* Email */}
          <div>
            <div
              className={`flex items-center gap-2.5 px-3.5 py-2.5 bg-zinc-50/90 dark:bg-zinc-900/90 border rounded-xl transition-all ${
                errors.emailInput
                  ? "border-red-400 focus-within:ring-2 focus-within:ring-red-400/30"
                  : "border-zinc-200 dark:border-zinc-700/80 focus-within:ring-2 focus-within:ring-indigo-500/40 focus-within:border-indigo-500"
              }`}
            >
              <MdOutlineAttachEmail size={18} className="text-zinc-400 shrink-0" />
              <input
                {...register("emailInput", {
                  required: {
                    value: true,
                    message: "Email is required",
                  },
                  pattern: {
                    value: /^\S+@\S+$/i,
                    message: "Email format is not valid",
                  },
                })}
                placeholder="Email address"
                type="text"
                className="w-full bg-transparent focus:outline-none text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 text-sm"
              />
            </div>
            {errors.emailInput?.message && (
              <span className="text-red-500 text-xs mt-1 block pl-1">
                {errors.emailInput.message.toString()}
              </span>
            )}
          </div>

          {/* Password */}
          <div>
            <div
              className={`flex items-center gap-2.5 px-3.5 py-2.5 bg-zinc-50/90 dark:bg-zinc-900/90 border rounded-xl transition-all ${
                errors.passwordInput
                  ? "border-red-400 focus-within:ring-2 focus-within:ring-red-400/30"
                  : "border-zinc-200 dark:border-zinc-700/80 focus-within:ring-2 focus-within:ring-indigo-500/40 focus-within:border-indigo-500"
              }`}
            >
              <CiLock size={18} className="text-zinc-400 shrink-0 font-bold" />
              <input
                onPaste={(e) => e.preventDefault()}
                onCopy={(e) => e.preventDefault()}
                onCut={(e) => e.preventDefault()}
                {...register("passwordInput", {
                  required: {
                    value: true,
                    message: "Password is required",
                  },
                  minLength: {
                    value: 8,
                    message: "Password must be at least 8 characters",
                  },
                })}
                type="password"
                placeholder="Password"
                className="w-full bg-transparent focus:outline-none text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 text-sm"
              />
            </div>
            {errors.passwordInput?.message && (
              <span className="text-red-500 text-xs mt-1 block pl-1">
                {errors.passwordInput.message.toString()}
              </span>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={disableBtn}
            className={`w-full cursor-pointer mt-1 font-semibold text-sm rounded-xl py-3 px-4 text-white flex items-center justify-center transition-all ${
              disableBtn
                ? "bg-indigo-400 cursor-not-allowed opacity-75"
                : "bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 shadow-md shadow-indigo-600/25 hover:shadow-lg hover:shadow-indigo-600/35 hover:-translate-y-0.5 active:translate-y-0"
            }`}
          >
            {disableBtn ? "Signing In..." : "Sign In"}
          </button>
        </form>

        {/* Footer Link */}
        <div className="mt-5 pt-4 border-t border-zinc-100 dark:border-zinc-800/80 text-center text-xs sm:text-sm text-zinc-500 dark:text-zinc-400">
          Don't have an account yet?{" "}
          <Link to="/signin" className="font-semibold text-indigo-600 dark:text-indigo-400 hover:underline">
            Sign up
          </Link>
        </div>
      </div>
    </div>
  );
}
