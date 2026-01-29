import { useForm } from "react-hook-form";
import { CiLock } from "react-icons/ci";
import { FaGoogle } from "react-icons/fa";
import { GiBrain } from "react-icons/gi";
import { MdOutlineAttachEmail } from "react-icons/md";
import { Link, useNavigate } from "react-router-dom";
import type { LoginProps } from "../Models/SignInProps";

export function Login() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginProps>();

  const nav = useNavigate();

  const login = async (credentials: LoginProps) => {
    const data = await fetch("http://localhost:3000/v0/api/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: credentials.passwordInput,
        password: credentials.emailInput,
      }),
    });
    if (data.status == 200) {
      const res = await data.json();
      localStorage.setItem("token", res.token);
      nav("/dashboard");
    }
  };

  return (
    <div className="bg-custom-gradient w-full h-screen bg-[rgb(18,18,18,1)] flex justify-center items-center">
      <span className="max-w-sm flex flex-col gap-4">
        <div className="text-white text-2xl justify-center items-center gap-3 title flex mb-8">
          <GiBrain size={48} color="#4f39f6" />
          Cerebro
        </div>
        <div className="flex justify-center">
          <button className="cursor-pointer rounded justify-center bg-indigo-600 text-center text-white py-4 px-4 flex items-center gap-2">
            <FaGoogle size={24} /> Sign up with Google
          </button>
        </div>
        <div className="text-white text-center">
          or, sign up with your email
        </div>
        <form onSubmit={handleSubmit(login)}>
          <div className="gap-3 flex flex-col">
            <div className="w-sm login-Input-Wrapper flex items-stretch rounded">
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
              <p className="text-red-600">
                {errors.emailInput.message.toString()}
              </p>
            )}
            <div className="w-sm login-Input-Wrapper flex items-stretch rounded">
              <div className="pl-2 flex items-center">
                <CiLock size={20} color="#a9a9a9" />
              </div>
              <input
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
                type="text"
                placeholder="Password..."
                className="focus:outline-none rounded text-white w-sm login-inputs  py-2 px-2"
              />
            </div>
            {errors.passwordInput?.message && (
              <p className="text-red-600">
                {errors.passwordInput.message.toString()}
              </p>
            )}
          </div>
          <div className="flex justify-center mt-3">
            <button
              disabled={isSubmitting}
              type="submit"
              className="rounded cursor-pointer text-md w-sm justify-center bg-indigo-600 text-center text-white py-2 px-4 flex items-center gap-2"
            >
              Continue
            </button>
          </div>
        </form>
        <div className="text-white">
          Don't have an account yet? <Link to={"/signin"}>Sign up</Link>{" "}
        </div>
      </span>
    </div>
  );
}
