import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { CgProfile } from "react-icons/cg";
import { GiBrain } from "react-icons/gi";
import { IoMdArrowUp } from "react-icons/io";
import Masonry from "react-masonry-css";
import type { CardProps, chatProps } from "../Models/CardProps";
import type { ConversationProps } from "../Models/ConversationProps";
import { CompactCard } from "./CompactCard";

const breakpointColumns = {
  default: 3,
  1100: 2,
  700: 1,
};

export const ChatWithAI = () => {
  const [msgList, setMsgList] = useState<ConversationProps[]>([]);
  const [isAIResReady, setIsAIResReady] = useState<boolean>(true);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { watch, reset, register, handleSubmit } = useForm<chatProps>({
    defaultValues: { userInput: "" },
  });
  const userChat = watch("userInput");
  const messagesEndRef = useRef<HTMLDivElement>(null);

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
      content: res.AIResponse.messages[0].content,
      sourceIds: res.AIResponse.messages[0].sourceIds,
      timeStamp: res.AIResponse.messages[0].timeStamp,
    };
    setMsgList((prevMsgList) => [...prevMsgList, newAIMessage]);
    // scrollToBottom();
    setIsAIResReady(() => true);
    setIsLoading(() => false);
    reset();
    console.log("check after loading:", newAIMessage);
  };

  useEffect(() => {
    scrollToBottom();
  }, [msgList]); // Scroll whenever msgList changes

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    const fetchChatHistory = async () => {
      const chatRes = await fetch("http://localhost:3000/v0/api/load-chat", {
        headers: {
          token: localStorage.getItem("token") || "",
        },
        method: "GET",
      });
      const data = await chatRes.json();
      setMsgList(data.messages);
      console.log(data, "In first fetch");
      // scrollToBottom();
    };
    fetchChatHistory();
  }, []);
  // HTML
  return (
    <div className=" ml-72 mt-13 p-5 flex flex-col items-center">
      <div id="message-container" className="w-205 mb-28">
        {msgList.map((msg: ConversationProps, ind) => (
          <>
            {msg.role == "user" ? (
              // FOR USER MESSAGE
              <>
                <div key={ind} className="mt-6 w-fit flex items-center ml-auto">
                  <div className="rounded-lg max-w-lg p-2 w-fit text-white bg-indigo-600">
                    {msg.content}
                  </div>
                  <div className="text-white ml-2">
                    {" "}
                    <CgProfile size={28} />
                  </div>
                </div>
                <div className="text-[#a9a9a9] ml-auto  text-xs mb-6 text-right">
                  {msg.timeStamp}
                </div>
              </>
            ) : (
              // FOR AI MESSAGE
              <>
                <div className="my-12">
                  <div className="flex items-center ">
                    <div className="text-white mr-2">
                      <GiBrain size={28} color="#4f39f6" />
                    </div>
                    <div
                      key={ind}
                      className="rounded-lg text-white w-fit max-w-full bg-[#30302E] p-2"
                    >
                      {msg.content}
                    </div>
                  </div>
                  {msg.sourceIds && msg.sourceIds.length > 0 && (
                    <Masonry
                      breakpointCols={breakpointColumns}
                      className="flex px-5 pt-4 gap-4"
                      columnClassName="masonry-column"
                    >
                      {msg.sourceIds.map((elem: CardProps) => (
                        <CompactCard
                          title={elem.title}
                          _id={elem._id}
                          createdAt={elem.createdAt.split("T")[0]}
                          type={elem.type}
                          description={elem.description}
                          key={elem._id}
                        />
                      ))}
                    </Masonry>
                  )}
                </div>
                {/* {JSON.stringify(msg.sourceIds)} */}
              </>
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
        <div ref={messagesEndRef} />
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
