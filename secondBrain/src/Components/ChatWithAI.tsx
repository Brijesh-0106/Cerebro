import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { HiOutlineChatBubbleLeftRight } from "react-icons/hi2";
import { IoMdArrowUp } from "react-icons/io";
import ReactMarkdown from "react-markdown";
import Masonry from "react-masonry-css";
import { useRecoilValue } from "recoil";
import type { CardProps, chatProps } from "../Models/CardProps";
import type { ConversationProps } from "../Models/ConversationProps";
import { SideBarAtom } from "../Recoil/SideBarAtom";
import { CompactCard } from "./CompactCard";

export const ChatWithAI = () => {
  const [msgList, setMsgList] = useState<ConversationProps[]>([]);
  const [isAIResReady, setIsAIResReady] = useState<boolean>(true);
  const [nochat, setNoChat] = useState<boolean>(false);
  const isSideBarCollapsed = useRecoilValue(SideBarAtom);

  let breakpointColumns;
  if (isSideBarCollapsed) {
    breakpointColumns = {
      default: 4,
      1400: 3,
      1100: 2,
      700: 1,
    };
  } else {
    breakpointColumns = {
      default: 3,
      1100: 2,
      700: 1,
    };
  }

  const [userPicture] = useState(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        return JSON.parse(storedUser).picture || "";
      } catch {
        return "";
      }
    }
    return "";
  });
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { watch, reset, register, handleSubmit } = useForm<chatProps>({
    defaultValues: { userInput: "" },
  });
  const userChat = watch("userInput");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const sendChat = async () => {
    const userText = userChat;
    reset();
    if (!userText || userText.trim() === "") return; // Guard clause
    setIsAIResReady(() => false);
    setIsLoading(() => true);
    const newMessage: ConversationProps = {
      role: "user", //assitant or user
      content: userText.trim(),
      timeStamp: new Date().toLocaleString(),
    };
    setMsgList((prevMsgList) => [...prevMsgList, newMessage]);
    setNoChat(() => false);
    const chatRes = await fetch(
      `${import.meta.env.VITE_BACKEND_URL}/v0/api/add-chat`,
      {
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
      },
    );
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
  };

  useEffect(() => {
    scrollToBottom();
  }, [msgList]); // Scroll whenever msgList changes

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    const fetchChatHistory = async () => {
      const chatRes = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/v0/api/load-chat`,
        {
          headers: {
            token: localStorage.getItem("token") || "",
          },
          method: "GET",
        },
      );
      const data = await chatRes.json();
      setMsgList(data.messages);
      if (!msgList.length) setNoChat(() => true);
      // scrollToBottom();
    };
    fetchChatHistory();
  }, []);

  // HTML
  return (
    <div
      className={`${isSideBarCollapsed ? "ml-13.75" : "ml-72"} max-md:ml-0 mt-6 p-5 flex flex-col items-center max-md:p-2`}
    >
      <div id="message-container" className="w-full max-w-[820px] max-md:px-2 mb-28">
        {!msgList.length && nochat && (
          <div className="flex mt-20 gap-4 flex-col justify-center items-center">
            <div className="empty-cards-Image h-40 w-40">
              <img
                src="/Assets/isolated_brain.png"
                className="h-full w-full object-contain p-2"
              />
            </div>
            <div className="empty-cards-desc text-zinc-900 dark:text-white">
              <div className="text-zinc-900 dark:text-white max-md:text-lg text-xl text-center">
                Welcome to your second brain
              </div>
              <div className="text-center mt-3 text-zinc-600 dark:text-[#a9a9a9] max-md:text-sm">
                Chat with Your Second Brain and see how it can assist you with
                your thoughts, tweets, youtube videos and more! Start by asking
                a question or sharing a thought.
              </div>
            </div>
            <div className="empty-cards-boxes">
              <button className="px-3 py-1 bg-primary/20 text-primary dark:bg-[#E6D8F2] dark:text-zinc-900 rounded flex items-center gap-1 hover:bg-primary/30 dark:hover:bg-purple-200 transition-colors">
                <HiOutlineChatBubbleLeftRight size={20} />
                Start Chatting
              </button>
            </div>
          </div>
        )}
        {msgList.length > 0 &&
          msgList.map((msg: ConversationProps, ind) => (
            <>
              {msg.role == "user" ? (
                // FOR USER MESSAGE
                <>
                  <div
                    key={ind}
                    className="mt-6 w-fit flex items-center ml-auto"
                  >
                    <div className="rounded-lg max-w-lg p-2 w-fit text-white bg-primary shadow-md">
                      {msg.content}
                    </div>
                    <div className="text-zinc-900 dark:text-white ml-2">
                      {/* <CgProfile size={28} /> */}
                      <img
                        src={userPicture}
                        alt="User Profile"
                        className="w-8 h-8 rounded-full"
                      />
                    </div>
                  </div>
                  <div className="text-zinc-500 dark:text-[#a9a9a9] ml-auto  text-xs mb-6 text-right">
                    {msg.timeStamp}
                  </div>
                </>
              ) : (
                // FOR AI MESSAGE
                <>
                  <div className="my-12">
                    <div className="flex items-center ">
                      <div className="mr-2 flex items-center justify-center">
                        <img src="/Assets/isolated_brain.png" className="w-9 h-9 object-contain" alt="AI Icon" />
                      </div>
                      <div
                        key={ind}
                        className="rounded-lg text-zinc-900 dark:text-white w-fit max-w-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-sm p-3"
                      >
                        <ReactMarkdown
                          components={{
                            p: ({ children, ...props }) => {
                              return (
                                <p className="text-zinc-700 dark:text-gray-200 mb-2" {...props}>
                                  {children}
                                </p>
                              );
                            },
                            li: ({ children, ...props }) => {
                              // Fix: join array children properly instead of String()
                              return (
                                <li
                                  style={{ listStyle: "inside" }}
                                  className="text-zinc-700 dark:text-gray-200 ml-5 mb-1"
                                  {...props}
                                >
                                  {children}
                                </li>
                              );
                            },
                          }}
                        >
                          {msg.content}
                        </ReactMarkdown>
                      </div>
                    </div>
                    {msg.sourceIds && msg.sourceIds.length > 0 && (
                      <Masonry
                        breakpointCols={breakpointColumns}
                        className="flex px-5 pt-4 gap-4"
                        columnClassName="masonry-column"
                      >
                        {msg.sourceIds.map((elem: CardProps, index: number) => (
                          <CompactCard
                            courceNo={index + 1}
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
            <div className="flex gap-1 px-3 py-1 bg-white dark:bg-[#30302E] border border-zinc-200 dark:border-transparent rounded-lg w-fit items-center shadow-sm">
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
      <div 
        className={`w-[95%] max-w-[820px] min-h-20 z-10 bg-white dark:bg-[#30302E] rounded-3xl mb-2 border border-zinc-300 dark:border-zinc-700 shadow-xl dark:shadow-none p-3 fixed gap-2 bottom-0 flex transform -translate-x-1/2 ${isSideBarCollapsed ? "left-[calc(50vw+27.5px)] max-md:left-1/2" : "left-[calc(50vw+144px)] max-md:left-1/2"}`}
      >
        <form onSubmit={handleSubmit(sendChat)} className="flex w-full">
          <div className="w-full">
            <textarea
              {...register("userInput", {})}
              className="text-zinc-900 dark:text-white w-full p-2 focus:outline-none movie-glow-text h-full resize-none bg-transparent"
              placeholder={`${isLoading ? "Processing..." : "💬 Chat with Your Second Brain..."}`}
            />
          </div>
          <span>
            {isLoading && (
              <button
                type="submit"
                disabled={true}
                className="cursor-pointer mt-2 bg-zinc-200 dark:bg-zinc-700 right-4 top-2 rounded-lg p-1"
              >
                <AiOutlineLoading3Quarters size={20} className="text-zinc-400 dark:text-zinc-500 animate-spin" />
              </button>
            )}
            {!isLoading &&
              (userChat !== "" ? (
                <button
                  type="submit"
                  className="cursor-pointer mt-2 bg-primary right-4 top-2 rounded-lg p-1 hover:opacity-90 transition-opacity"
                >
                  <IoMdArrowUp size={20} className="text-white" />
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={true}
                  className="cursor-pointer mt-2 bg-zinc-200 dark:bg-zinc-700 right-4 top-2 rounded-lg p-1"
                >
                  <IoMdArrowUp size={20} className="text-zinc-400 dark:text-zinc-500" />
                </button>
              ))}
          </span>
        </form>
      </div>
    </div>
  );
};
