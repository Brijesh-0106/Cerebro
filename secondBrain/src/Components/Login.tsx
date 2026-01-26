import { useState } from "react";
import { CiLock } from "react-icons/ci";
import { FaGoogle } from "react-icons/fa";
import { GiBrain } from "react-icons/gi";
import { MdOutlineAttachEmail } from "react-icons/md";

export function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

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
        <div className="gap-3 flex flex-col">
          <div className="w-sm login-Input-Wrapper flex items-stretch rounded">
            <div className="pl-2 flex items-center">
              <MdOutlineAttachEmail size={20} color="#a9a9a9" />
            </div>
            <input
              placeholder="Email..."
              type="text"
              className="focus:outline-none text-white rounded w-sm login-inputs  py-2 px-2"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
              }}
            />
          </div>
          <div className="w-sm login-Input-Wrapper flex items-stretch rounded">
            <div className="pl-2 flex items-center">
              <CiLock size={20} color="#a9a9a9" />
            </div>
            <input
              type="text"
              placeholder="Password..."
              className="focus:outline-none rounded text-white w-sm login-inputs  py-2 px-2"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
              }}
            />
          </div>
        </div>
        <div className="flex justify-center">
          <button className="rounded cursor-pointer text-md w-sm justify-center bg-indigo-600 text-center text-white py-2 px-4 flex items-center gap-2">
            Continue
          </button>
        </div>
        <div className="text-white">Don't have an account yet? Sign up</div>
      </span>
    </div>
  );
}
