import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { GiBrain } from "react-icons/gi";
import { HiOutlineChatBubbleLeftRight } from "react-icons/hi2";
import { IoMdArrowUp } from "react-icons/io";
import ReactMarkdown from "react-markdown";
import Masonry from "react-masonry-css";
import { useRecoilValue } from "recoil";
import imgSrc from "../../public/Assets/Gemini_Generated_Image_7667fc7667fc7667.png";
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
      className={`${isSideBarCollapsed ? "ml-13.75" : "ml-72"} mt-6 p-5 flex flex-col items-center`}
    >
      <div id="message-container" className="w-205 mb-28">
        {!msgList.length && nochat && (
          <div className="flex mt-20 gap-4 flex-col justify-center items-center">
            <div className="empty-cards-Image h-60">
              <img
                src={imgSrc}
                className="rounded-3xl h-full w-full border border-[#a9a9a9] object-cover"
              />
            </div>
            <div className="empty-cards-desc text-white">
              <div className="text-white text-xl text-center">
                Welcome to your second brain
              </div>
              <div className="text-center mt-3 text-[#a9a9a9]">
                Chat with Your Second Brain and see how it can assist you with
                your thoughts, tweets, youtube videos and more! Start by asking
                a question or sharing a thought.
              </div>
            </div>
            <div className="empty-cards-boxes">
              <button className="px-3 py-1 bg-[#E6D8F2]  rounded flex items-center gap-1">
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
                    <div className="rounded-lg max-w-lg p-2 w-fit text-white bg-indigo-600">
                      {msg.content}
                    </div>
                    <div className="text-white ml-2">
                      {/* <CgProfile size={28} /> */}
                      <img
                        src={userPicture}
                        alt="User Profile"
                        className="w-8 h-8 rounded-full"
                      />
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
                        className="rounded-lg text-white w-fit max-w-full bg-[#000000] p-2"
                      >
                        <ReactMarkdown
                          components={{
                            p: ({ children, ...props }) => {
                              return (
                                <p className="text-gray-200 mb-2" {...props}>
                                  {children}
                                </p>
                              );
                            },
                            li: ({ children, ...props }) => {
                              // Fix: join array children properly instead of String()
                              return (
                                <li
                                  style={{ listStyle: "inside" }}
                                  className="text-gray-200 ml-5 mb-1"
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
              placeholder={`${isLoading ? "Processing..." : "💬 Chat with Your Second Brain..."}`}
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
