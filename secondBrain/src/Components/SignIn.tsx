import { useState } from "react";
import { CiLock } from "react-icons/ci";
import { FaGoogle } from "react-icons/fa";
import { GiBrain } from "react-icons/gi";
import { MdOutlineAttachEmail, MdOutlinePerson } from "react-icons/md";
import { Link, useNavigate } from "react-router-dom";
import { Alert } from "./Alert";

export function SignIn() {
  const [userName, setUserName] = useState("");
  const nav = useNavigate();
  const [email, setEmail] = useState("");
  const [showAlert, setShowAlert] = useState(false);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // const {
  //   register,
  //   handleSubmit,
  //   formState: { errors },
  // } = useForm();

  const signin = async () => {
    const res = await fetch("http://localhost:3000/v0/api/signin", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: userName,
        email: email,
        password: password,
      }),
    });
    if (res.status == 200) {
      await res.json();
      setShowAlert(true);
      setTimeout(() => {
        setShowAlert(false);
        nav("/login");
      }, 1000);
    } else {
      alert("Temporary Closed");
    }
  };

  return (
    <div className="bg-custom-gradient w-full h-screen bg-[rgb(18,18,18,1)] flex justify-center items-center">
      <span className="max-w-sm flex flex-col gap-4">
        <div className="text-white text-2xl justify-center items-center gap-3 title flex mb-8">
          <GiBrain size={48} color="#4f39f6" />
          {showAlert && (
            <Alert
              title="User Created Successfully"
              type="success"
              onClose={() => console.log("Closed")}
            />
          )}
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
              <MdOutlinePerson size={20} color="#a9a9a9" />
            </div>
            <input
              className="focus:outline-none text-white login-inputs w-sm rounded py-2 px-2"
              type="text"
              placeholder="Name..."
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
            />
          </div>
          <div className="w-sm login-Input-Wrapper flex items-stretch rounded">
            <div className="pl-2 flex items-center">
              <MdOutlineAttachEmail size={20} color="#a9a9a9" />
            </div>
            <input
              placeholder="Email..."
              type="text"
              required
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
              required
              placeholder="Password..."
              className="focus:outline-none rounded text-white w-sm login-inputs  py-2 px-2"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
              }}
            />
          </div>
          <div className="w-sm login-Input-Wrapper flex items-stretch rounded">
            <div className="pl-2 flex items-center">
              <CiLock size={20} color="#a9a9a9" />
            </div>
            <input
              type="text"
              placeholder="Confirm Password..."
              value={confirmPassword}
              required
              className="focus:outline-none rounded text-white w-sm login-inputs  py-2 px-2"
              onChange={(e) => {
                setConfirmPassword(e.target.value);
              }}
            />
          </div>
        </div>
        <div className="flex justify-center">
          <button
            onClick={() => signin()}
            className="cursor-pointer rounded text-md w-sm justify-center bg-indigo-600 text-center text-white py-2 px-4 flex items-center gap-2"
          >
            Continue
          </button>
        </div>
        <div className="text-white">
          Already have an account? <Link to={"/login"}>Login</Link>
        </div>
      </span>
    </div>
  );
}
