import { GiBrain } from "react-icons/gi";
import { useNavigate } from "react-router-dom";
// rgb(204, 123, 244)
export default function Navbar() {
  const nav = useNavigate();
  return (
    <div className="w-full flex justify-between items-center px-4 py-2 bg-zinc-900 h-[7vh]">
      <div className="logoSection text-xl items-center gap-1 text-[#4f39f6] flex pl-8 font-bold">
        <GiBrain size={36} color="#4f39f6" />
        <span
          className="text-3xl font-bold"
          style={{
            fontFamily: "'Lobster Two', cursive",
            fontStyle: "italic",
            letterSpacing: "0.08em",
          }}
        >
          CereBro
        </span>
      </div>
      <div className="flex gap-20">
        <button
          className="cursor-pointer items-center flex  text-[#faf9f5] px-4 py-1 rounded-lg border-zinc-500 transition-colors border hover:border-0 hover:bg-indigo-600"
          onClick={() => nav("/signin")}
        >
          SignIn
        </button>
      </div>
    </div>
  );
}
