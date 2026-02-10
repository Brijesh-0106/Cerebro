import { useState } from "react";
import { useForm } from "react-hook-form";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { IoMdArrowUp } from "react-icons/io";
import type { chatProps } from "../Models/CardProps";
import type { ConversationProps } from "../Models/ConversationProps";

export const ChatWithAI = () => {
  const [msgList, setMsgList] = useState<ConversationProps[]>([]);
  const [isAIResReady, setIsAIResReady] = useState<boolean>(true);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const sendChat = async () => {
    if (!userChat || userChat.trim() === "") return; // Guard clause
    setIsAIResReady(() => false);
    setIsLoading(() => true);
    const newMessage: ConversationProps = {
      role: "user", //assitant or user
      content: userChat,
      timeStamp: new Date().toLocaleString(),
    };
    setMsgList((prevMsgList) => [...prevMsgList, newMessage]);
    const chatRes = await fetch("http://localhost:3000/v0/api/add-chat", {
      headers: {
        token: localStorage.getItem("token") || "",
        "Content-Type": "application/json", // ✅ Critical
      },
      method: "POST",
      body: JSON.stringify({
        content: newMessage.content,
        role: newMessage.role,
        timeStamp: newMessage.timeStamp,
      }),
    });
    const res = await chatRes.json();
    const newAIMessage: ConversationProps = {
      role: "assistant", //assitant or user
      content: res.AIResponse.content,
      timeStamp: res.AIResponse.timeStamp,
    };
    setMsgList((prevMsgList) => [...prevMsgList, newAIMessage]);
    setIsAIResReady(() => true);
    setIsLoading(() => false);
    reset();
    console.log("check after loading:", userChat);
  };

  const { watch, reset, register, handleSubmit } = useForm<chatProps>({
    defaultValues: { userInput: "" },
  });

  const userChat = watch("userInput");
  return (
    <div className=" ml-72 mt-13 p-5 flex flex-col items-center">
      <div className="w-205 mb-28">
        {msgList.map((msg: ConversationProps, ind) => (
          <>
            {msg.role == "user" ? (
              <>
                <div
                  key={ind}
                  className="rounded-lg max-w-lg text-white bg-indigo-600 mt-4 w-fit p-2 ml-auto"
                >
                  {msg.content}
                </div>
                <div className="text-[#a9a9a9] ml-auto  text-xs mb-4 text-right">
                  {msg.timeStamp}
                </div>
              </>
            ) : (
              <div
                key={ind}
                className="rounded-lg text-white w-fit border max-w-lg border-[#a9a9a9] mt-4 mb-4 bg-[#30302E] p-2"
              >
                {msg.content}
              </div>
            )}
          </>
        ))}
        {!isAIResReady && (
          <>
            <div className="flex gap-1 px-3 py-1 bg-[#30302E] rounded-lg w-fit items-center">
              <div
                className="w-1.5 h-1.5 mt-1 bg-gray-400 rounded-full animate-bounce"
                style={{ animationDelay: "0ms" }}
              ></div>
              <div
                className="w-1.5 h-1.5 mt-1 bg-gray-400 rounded-full animate-bounce"
                style={{ animationDelay: "150ms" }}
              ></div>
              <div
                className="w-1.5 h-1.5 mt-1 bg-gray-400 rounded-full animate-bounce"
                style={{ animationDelay: "300ms" }}
              ></div>
            </div>
          </>
        )}
      </div>
      <div className="w-205 min-h-20 z-10 bg-[#30302E] rounded-3xl mb-2 border border-[#a9a9a9] p-3 fixed gap-2 bottom-0">
        <form onSubmit={handleSubmit(sendChat)} className="flex">
          <div className="w-full">
            <textarea
              {...register("userInput", {})}
              className="text-white w-full p-2 focus:outline-none movie-glow-text h-full resize-none"
              placeholder="💬 Chat with Your Second Brain..."
            />
          </div>
          <span>
            {isLoading && (
              <button
                type="submit"
                disabled={true}
                className="cursor-pointer mt-2 bg-[#a9a9a9] right-4 top-2 rounded-lg p-1"
              >
                <AiOutlineLoading3Quarters size={20} color="#000" />
              </button>
            )}
            {!isLoading &&
              (userChat !== "" ? (
                <button
                  type="submit"
                  className="cursor-pointer mt-2 bg-[#ffffff] right-4 top-2 rounded-lg p-1"
                >
                  <IoMdArrowUp size={20} color="#4f39f6" />
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={true}
                  className="cursor-pointer mt-2 bg-[#a9a9a9] right-4 top-2 rounded-lg p-1"
                >
                  <IoMdArrowUp size={20} color="#000" />
                </button>
              ))}
          </span>
        </form>
      </div>
    </div>
  );
};
