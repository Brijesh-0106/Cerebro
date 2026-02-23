import { useState } from "react";
import { useForm } from "react-hook-form";
import { IoMdClose } from "react-icons/io";
import { useNavigate } from "react-router-dom";
import { useSetRecoilState } from "recoil";
import type { alertType, CardProps } from "../Models/CardProps";
import { CardAtom } from "../Recoil/CardAtom";
import { Alert } from "./Alert";
import { Leftbar } from "./Leftbar";
import MultiTagSelect from "./MultiTagSelect";
import { Topbar } from "./Topbar";
import { UserArea } from "./UserArea";

export const Dashboard = () => {
  const [openAddContentModal, setOpenAddContentModal] = useState(false);
  // const [isCollapsed, setIsCollapsed] = useState<boolean>(false);
  const [alertMsg, setAlertMsg] = useState("");
  const nav = useNavigate();
  const [disableBtn, setDisableBtn] = useState(false);
  const [alertType, setAlertType] = useState<alertType>("success");
  const [showAlert, setShowAlert] = useState(false);
  const {
    setValue,
    watch,
    reset,
    setError,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CardProps>({
    defaultValues: {
      tags: [],
    },
  });

  const tags = watch("tags");
  const contentType = watch("type");
  const setCards = useSetRecoilState(CardAtom);
  function isValidArticleUrl(url: string): boolean {
    try {
      const parsedUrl = new URL(url);

      // Must be http/https
      if (parsedUrl.protocol !== "http:" && parsedUrl.protocol !== "https:") {
        return false;
      }

      // Block obvious non-articles
      const blocked = [".pdf", ".jpg", ".png", ".mp4", ".zip", ".exe"];
      if (blocked.some((ext) => url.toLowerCase().endsWith(ext))) {
        return false;
      }

      return true;
    } catch {
      return false;
    }
  }
  // Add article
  const createArticle = async (formData: CardProps) => {
    setDisableBtn(true);
    if (!isValidArticleUrl(formData.contentUrl!)) {
      setError("contentUrl", {
        type: "IDK",
        message: "Invalid URL",
      });
      setDisableBtn(false);
      return;
    }
    const contentRes = await fetch(
      `${import.meta.env.VITE_BACKEND_URL}/v0/api/add-web-article`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          token: localStorage.getItem("token") as string,
        },

        body: JSON.stringify({
          tags: formData.tags,
          desc: formData.description,
          type: formData.type,
          url: formData.contentUrl as string,
        }),
      },
    );
    if (contentRes.status == 400) {
      const res = await contentRes.json();
      console.log(res);
      setError(res.type, { type: "IDK", message: res.error });
      setAlertType("error");
      setAlertMsg("Wrong content, Article is not saved!");
      setShowAlert(true);
      setTimeout(() => {
        setShowAlert(false);
      }, 2500);
      setDisableBtn(false);
      return;
    } else if (contentRes.status == 201) {
      reset();
      const data = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/v0/api/get-all-content`,
        {
          method: "GET",
          headers: {
            token: localStorage.getItem("token") as string,
          },
        },
      );
      const res = await data.json();
      setCards([...res["AllUserContent"]]);
      setOpenAddContentModal(false);
      setAlertMsg("Successfully saved!");
      setAlertType("success");
      setShowAlert(true);
      nav("/dashboard/all-content");
      setTimeout(() => {
        setShowAlert(false);
      }, 2500);
    } else {
      setAlertType("error");
      setAlertMsg("Wrong Content, Article is not saved!");
      setShowAlert(true);
      setTimeout(() => {
        setShowAlert(false);
      }, 2500);
    }
    setDisableBtn(false);
  };
  // ---------------------------------------------------------- ADD CONTENT CARD
  const createCard = async (formData: CardProps) => {
    setDisableBtn(true);
    if (formData.type == "youtube") {
      if (formData.contentUrl?.includes("shorts")) {
        formData.contentUrl = formData.contentUrl.replace("shorts", "embed");
      } else if (formData.contentUrl?.includes("watch?v=")) {
        formData.contentUrl = formData.contentUrl.replace("watch?v=", "embed/");
      } else if (formData.contentUrl?.includes("youtu.be")) {
        formData.contentUrl = formData.contentUrl.replace(
          "youtu.be",
          "www.youtube.com/embed",
        );
      } else if (
        !formData.contentUrl?.includes("www.youtube.com/embed") &&
        !formData.contentUrl?.includes("https://")
      ) {
        setError("contentUrl", {
          type: "InValid URL",
          message: "Please enter a valid YouTube link",
        });
        setDisableBtn(false);
        return;
      }
    } else if (formData.type == "tweet") {
      if (formData.contentUrl?.includes("x.com")) {
        formData.contentUrl = formData.contentUrl.replace(
          "x.com",
          "twitter.com",
        );
      } else if (
        !formData.contentUrl?.includes("x.com") &&
        !formData.contentUrl?.includes("twitter.com") &&
        !formData.contentUrl?.includes("status") &&
        !formData.contentUrl?.includes("https://")
      ) {
        setError("contentUrl", {
          type: "InValid URL",
          message: "Please enter a valid Twitter link",
        });
        setDisableBtn(false);
        return;
      }
    }
    const Data = new FormData();
    if (formData.imageUrl && formData.imageUrl.length > 0) {
      Data.append("imageUrl", formData.imageUrl[0]);
    }
    Data.append("tags", JSON.stringify(formData.tags));
    Data.append("desc", formData.description);
    if (formData.title) {
      Data.append("title", formData.title);
    }
    Data.append("type", formData.type);
    Data.append("url", formData.contentUrl as string);
    const contentRes = await fetch(
      `${import.meta.env.VITE_BACKEND_URL}/v0/api/add-content`,
      {
        method: "POST",
        headers: {
          token: localStorage.getItem("token") as string,
        },

        body: Data,
      },
    );
    if (contentRes.status == 400) {
      const res = await contentRes.json();
      console.log(res);
      setError(res.type, { type: "IDK", message: res.error });
      setAlertType("error");
      setAlertMsg("Sorry, Content is not saved!");
      setShowAlert(true);
      setTimeout(() => {
        setShowAlert(false);
      }, 2500);
      setDisableBtn(false);
      return;
      // console.log(contentRes);
      // console.log(contentRes);
    } else if (contentRes.status == 201) {
      reset();
      const data = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/v0/api/get-all-content`,
        {
          method: "GET",
          headers: {
            token: localStorage.getItem("token") as string,
          },
        },
      );
      const res = await data.json();
      setCards([...res["AllUserContent"]]);
      setOpenAddContentModal(false);
      setAlertMsg("Successfully saved!");
      setAlertType("success");
      setShowAlert(true);
      nav("/dashboard/all-content");
      setTimeout(() => {
        setShowAlert(false);
      }, 2500);
    } else {
      setAlertType("error");
      setAlertMsg("Sorry, Content is not saved!");
      setShowAlert(true);
      setTimeout(() => {
        setShowAlert(false);
      }, 2500);
    }
    setDisableBtn(false);
  };

  // -------------------------------------------------------------------- JSX
  return (
    <>
      <div
        className={
          openAddContentModal
            ? "w-screen h-screen bg-black max-w-screen "
            : "min-w-screen min-h-screen max-w-screen bg-[radial-gradient(1200px_600px_at_top_left,rgba(112,59,247,0.65)_0%,rgba(112,59,247,0.25)_35%,rgba(18,18,18,0)_60%),radial-gradient(1200px_600px_at_bottom_right,rgba(112,59,247,0.65)_0%,rgba(112,59,247,0.25)_35%,rgba(18,18,18,0)_60%),linear-gradient(135deg,#121212_45%,#000_75%)]"
        }
      >
        {showAlert && <Alert type={alertType} title={alertMsg} />}
        ;
        <Leftbar />
        <Topbar curr={openAddContentModal} setCurr={setOpenAddContentModal} />
        <UserArea />
        {/* -------------------------------------- ADD CONTENT MODAL -------------------------------------- */}
        {openAddContentModal && (
          <div className="fixed inset-0 bg-custom-gradient bg-black/90 z-40" />
        )}
        {openAddContentModal && (
          <div className="fixed  inset-0 flex items-center justify-center z-50">
            <div className="bg-white text-black rounded-xl w-96">
              <div className="header border-b border-gray-400 p-2 text-lg font-semibold text-indigo-600 flex justify-between items-center">
                {contentType === "thought"
                  ? "Capture a thought for your future self"
                  : contentType === "article"
                    ? "Capture a article for your future self"
                    : "Capture a content for your future self"}
                <IoMdClose
                  size={20}
                  className="cursor-pointer"
                  onClick={() => setOpenAddContentModal(false)}
                />
              </div>
              <form
                onSubmit={
                  contentType === "article"
                    ? handleSubmit(createArticle)
                    : handleSubmit(createCard)
                }
              >
                <div className="body py-2 px-4">
                  <div className="flex flex-col">
                    <div
                      className={
                        errors.type
                          ? "border border-indigo-600 flex items-stretch rounded"
                          : "border mb-2 border-indigo-600 flex items-stretch rounded"
                      }
                    >
                      <select
                        {...register("type", {
                          required: "Type is Required",
                        })}
                        name="type"
                        className="w-full py-2 focus:outline-none px-2 text-black"
                      >
                        <option
                          value={""}
                          className="w-full text-black py-2 px-2"
                        >
                          Select type...
                        </option>
                        <option
                          className="w-full text-black py-2 px-2"
                          value={"thought"}
                        >
                          Thought
                        </option>
                        <option
                          className="w-full text-black py-2 px-2"
                          value={"youtube"}
                        >
                          Youtube
                        </option>
                        <option
                          className="w-full text-black py-2 px-2"
                          value={"article"}
                        >
                          Article
                        </option>
                        <option
                          className="w-full text-black py-2 px-2"
                          value={"tweet"}
                        >
                          Twitter
                        </option>
                      </select>
                    </div>
                    {errors.type?.message && (
                      <p className="text-red-600 mb-1 pl-1">
                        {errors.type.message.toString()}
                      </p>
                    )}
                    {contentType != "article" && (
                      <>
                        <div
                          className={
                            errors.title
                              ? "border border-indigo-600 flex items-stretch rounded"
                              : "border mb-2 border-indigo-600 flex items-stretch rounded"
                          }
                        >
                          <input
                            {...register("title", {
                              required: {
                                value: true,
                                message: "Title is Required",
                              },
                              minLength: {
                                value: 3,
                                message: "Title must be at least 3 characters",
                              },
                            })}
                            className="w-full focus:outline-none text-black login-inputs rounded py-2 px-2"
                            type="text"
                            placeholder="Title..."
                          />
                        </div>
                        {errors.title?.message && (
                          <p className="text-red-600 mb-1 pl-1">
                            {errors.title.message.toString()}
                          </p>
                        )}
                      </>
                    )}
                    <div
                      className={
                        errors.description
                          ? "border border-indigo-600  flex items-stretch rounded"
                          : "border mb-2 border-indigo-600 flex items-stretch rounded"
                      }
                    >
                      <textarea
                        {...register("description", {
                          required: {
                            value: true,
                            message: "Description is Required",
                          },
                          minLength: {
                            value: 5,
                            message:
                              "Description must be at least 5 characters",
                          },
                        })}
                        placeholder="Why do you want save this?..."
                        className="text-black add-textArea focus:outline-none rounded w-full py-2 px-2"
                        rows={2}
                      ></textarea>
                    </div>
                    {errors.description?.message && (
                      <p className="text-red-600 mb-1 pl-1">
                        {errors.description.message.toString()}
                      </p>
                    )}
                    {contentType === "thought" ? (
                      <>
                        <div
                          className={
                            errors.imageUrl
                              ? "border border-indigo-600 flex items-stretch rounded"
                              : "border mb-2 border-indigo-600 flex items-stretch rounded"
                          }
                        >
                          <input
                            type="file"
                            accept="image/*"
                            {...register("imageUrl")}
                            className="file:bg-indigo-600 w-full file:text-white file:px-4 file:py-1 file:rounded file:border-0 text-black"
                          />
                        </div>
                        {errors.imageUrl?.message && (
                          <p className="text-red-600 mb-1 pl-1">
                            {errors.imageUrl.message.toString()}
                          </p>
                        )}
                      </>
                    ) : (
                      <>
                        <div
                          className={
                            errors.contentUrl
                              ? "border border-indigo-600 flex items-stretch rounded"
                              : "border mb-2 border-indigo-600 flex items-stretch rounded"
                          }
                        >
                          <input
                            {...register("contentUrl", {
                              required: {
                                value: true,
                                message: "Content Link is Required",
                              },
                              minLength: {
                                value: 8,
                                message:
                                  "Content link must be at least 8 characters",
                              },
                            })}
                            type="text"
                            placeholder={`${contentType === "youtube" ? "Youtube link..." : contentType === "article" ? "Article link..." : "Tweet link..."}`}
                            className="w-full focus:outline-none rounded text-black login-inputs  py-2 px-2"
                          />
                        </div>

                        {errors.contentUrl?.message && (
                          <p className="text-red-600 mb-1 pl-1">
                            {errors.contentUrl.message.toString()}
                          </p>
                        )}
                      </>
                    )}
                    <div className="border  border-indigo-600 flex items-stretch rounded">
                      <MultiTagSelect
                        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                        // @ts-expect-error
                        value={tags}
                        onChange={(val) => setValue("tags", val)}
                      />
                    </div>
                  </div>
                </div>
                <div className="footer flex flex-row-reverse border-t border-indigo-600 p-2">
                  {!disableBtn ? (
                    <button
                      type="submit"
                      className="cursor-pointer py-1 bg-indigo-600 w-28 text-white font-semibold rounded"
                    >
                      Add
                    </button>
                  ) : (
                    <button
                      disabled={disableBtn}
                      className="cursor-pointer rounded text-md w-sm justify-center bg-indigo-900 text-center text-gray-400 py-2 px-4 flex items-center gap-2"
                    >
                      Processing
                    </button>
                  )}
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </>
  );
};
