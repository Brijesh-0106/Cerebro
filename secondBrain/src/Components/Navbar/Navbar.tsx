import { useNavigate } from "react-router-dom";
// rgb(204, 123, 244)
export default function Navbar() {
  const nav = useNavigate();
  return (
    <div className="w-full flex justify-between items-center px-4 py-2 bg-white dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-800 h-[7vh]">
      <div className="logoSection max-md:text-lg text-xl items-center gap-1 text-primary flex pl-8 max-md:pl-0 font-bold">
        <img src="/Assets/isolated_brain.png" className="w-10 h-10 object-contain" alt="CereBro Logo" />
        {/* Merienda, Courgette */}
        <div
          style={{ lineHeight: "43px", height: "36px" }}
          className="great-vibes font-semibold font-[Courgette] max-md:text-[24px] text-[28px] text-primary"
        >
          CereBro
        </div>
      </div>
      <div className="flex gap-20">
        <button
          className="cursor-pointer items-center flex text-zinc-900 dark:text-[#faf9f5] max-md:text-sm px-4 py-1 rounded-lg border-zinc-300 dark:border-zinc-500 transition-all border hover:border-primary dark:hover:border-primary hover:bg-primary hover:text-white"
          onClick={() => nav("/signin")}
        >
          SignIn
        </button>
      </div>
    </div>
  );
}
