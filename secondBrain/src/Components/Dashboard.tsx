import { useState } from "react";
import { useForm } from "react-hook-form";
import { IoMdClose } from "react-icons/io";
import { useNavigate } from "react-router-dom";
import { useSetRecoilState } from "recoil";
import type { alertType, CardProps } from "../Models/CardProps";
import { CardAtom } from "../Recoil/CardAtom";
import { Alert } from "./Alert";
import MultiTagSelect from "./MultiTagSelect";
import { Topbar } from "./Topbar";
import { UserArea } from "./UserArea";

export const Dashboard = () => {
  const [openAddContentModal, setOpenAddContentModal] = useState(false);
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
        className="min-w-screen min-h-screen pt-4 max-w-screen bg-canvas-grid transition-colors duration-200 text-zinc-900 dark:text-zinc-100"
      >
        {showAlert && <Alert type={alertType} title={alertMsg} />}
        <Topbar curr={openAddContentModal} setCurr={setOpenAddContentModal} />
        <UserArea />

        {/* -------------------------------------- ADD CONTENT MODAL -------------------------------------- */}
        {openAddContentModal && (
          <div
            className="fixed inset-0 bg-black/40 dark:bg-black/70 z-40 backdrop-blur-sm transition-opacity"
            onClick={() => setOpenAddContentModal(false)}
          />
        )}
        {openAddContentModal && (
          <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-[#141620] text-zinc-900 dark:text-zinc-100 rounded-2xl w-full max-w-lg shadow-2xl border border-zinc-200/80 dark:border-zinc-800/90 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
              <div className="header border-b border-zinc-200/80 dark:border-zinc-800/80 px-6 py-4 flex justify-between items-center bg-zinc-50/50 dark:bg-[#11131a]/50">
                <h3 className="text-base font-semibold text-zinc-900 dark:text-zinc-100">
                  {contentType === "thought"
                    ? "Capture a thought for your future self"
                    : contentType === "article"
                      ? "Capture an article for your future self"
                      : "Capture content for your future self"}
                </h3>
                <button
                  type="button"
                  onClick={() => setOpenAddContentModal(false)}
                  className="p-1 rounded-lg text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
                  aria-label="Close modal"
                >
                  <IoMdClose size={20} />
                </button>
              </div>
              <form
                onSubmit={
                  contentType === "article"
                    ? handleSubmit(createArticle)
                    : handleSubmit(createCard)
                }
              >
                <div className="body p-6 space-y-4">
                  <div className="flex flex-col gap-3">
                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 mb-1.5">
                        Type
                      </label>
                      <select
                        {...register("type", {
                          required: "Type is Required",
                        })}
                        name="type"
                        className="w-full py-2.5 px-3 rounded-xl bg-zinc-50 dark:bg-[#0c0d14] border border-zinc-200 dark:border-zinc-700/80 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-sm transition-all"
                      >
                        <option value="">Select type...</option>
                        <option value="thought">Thought</option>
                        <option value="youtube">Youtube</option>
                        <option value="article">Article</option>
                        <option value="tweet">Twitter</option>
                      </select>
                      {errors.type?.message && (
                        <p className="text-red-500 text-xs mt-1 pl-1">
                          {errors.type.message.toString()}
                        </p>
                      )}
                    </div>

                    {contentType != "article" && (
                      <div>
                        <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 mb-1.5">
                          Title
                        </label>
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
                          className="w-full py-2.5 px-3 rounded-xl bg-zinc-50 dark:bg-[#0c0d14] border border-zinc-200 dark:border-zinc-700/80 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-sm transition-all placeholder:text-zinc-400 dark:placeholder:text-zinc-500"
                          type="text"
                          placeholder="Title..."
                        />
                        {errors.title?.message && (
                          <p className="text-red-500 text-xs mt-1 pl-1">
                            {errors.title.message.toString()}
                          </p>
                        )}
                      </div>
                    )}

                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 mb-1.5">
                        Description
                      </label>
                      <textarea
                        {...register("description", {
                          required: {
                            value: true,
                            message: "Description is Required",
                          },
                          minLength: {
                            value: 5,
                            message: "Description must be at least 5 characters",
                          },
                        })}
                        placeholder="Why do you want to save this?..."
                        className="w-full py-2.5 px-3 rounded-xl bg-zinc-50 dark:bg-[#0c0d14] border border-zinc-200 dark:border-zinc-700/80 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-sm transition-all resize-none placeholder:text-zinc-400 dark:placeholder:text-zinc-500"
                        rows={3}
                      />
                      {errors.description?.message && (
                        <p className="text-red-500 text-xs mt-1 pl-1">
                          {errors.description.message.toString()}
                        </p>
                      )}
                    </div>

                    {contentType === "thought" ? (
                      <div>
                        <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 mb-1.5">
                          Image (Optional)
                        </label>
                        <input
                          type="file"
                          accept="image/*"
                          {...register("imageUrl")}
                          className="file:bg-zinc-900 dark:file:bg-indigo-600 w-full file:text-white file:px-4 file:py-1.5 file:rounded-lg file:border-0 text-zinc-700 dark:text-zinc-300 text-sm file:mr-3 file:cursor-pointer"
                        />
                        {errors.imageUrl?.message && (
                          <p className="text-red-500 text-xs mt-1 pl-1">
                            {errors.imageUrl.message.toString()}
                          </p>
                        )}
                      </div>
                    ) : (
                      <div>
                        <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 mb-1.5">
                          Content Link
                        </label>
                        <input
                          {...register("contentUrl", {
                            required: {
                              value: true,
                              message: "Content Link is Required",
                            },
                            minLength: {
                              value: 8,
                              message: "Content link must be at least 8 characters",
                            },
                          })}
                          type="text"
                          placeholder={`${contentType === "youtube" ? "https://youtube.com/watch?v=..." : contentType === "article" ? "https://example.com/article" : "https://x.com/username/status/..."}`}
                          className="w-full py-2.5 px-3 rounded-xl bg-zinc-50 dark:bg-[#0c0d14] border border-zinc-200 dark:border-zinc-700/80 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-sm transition-all placeholder:text-zinc-400 dark:placeholder:text-zinc-500"
                        />
                        {errors.contentUrl?.message && (
                          <p className="text-red-500 text-xs mt-1 pl-1">
                            {errors.contentUrl.message.toString()}
                          </p>
                        )}
                      </div>
                    )}

                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 mb-1.5">
                        Tags
                      </label>
                      <div className="rounded-xl overflow-hidden">
                        <MultiTagSelect
                          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                          // @ts-expect-error
                          value={tags}
                          onChange={(val) => setValue("tags", val)}
                        />
                      </div>
                    </div>
                  </div>
                </div>
                <div className="footer flex justify-end gap-3 border-t border-zinc-200/80 dark:border-zinc-800/80 px-6 py-4 bg-zinc-50/50 dark:bg-[#11131a]/50">
                  <button
                    type="button"
                    onClick={() => setOpenAddContentModal(false)}
                    className="cursor-pointer px-4 py-2 text-sm font-medium text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100 rounded-xl hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
                  >
                    Cancel
                  </button>
                  {!disableBtn ? (
                    <button
                      type="submit"
                      className="cursor-pointer py-2 px-5 bg-zinc-900 hover:bg-zinc-800 dark:bg-indigo-600 dark:hover:bg-indigo-500 text-white text-sm font-medium rounded-xl shadow-sm transition-all hover:shadow"
                    >
                      Add Content
                    </button>
                  ) : (
                    <button
                      disabled={disableBtn}
                      className="cursor-not-allowed rounded-xl text-sm bg-zinc-400 dark:bg-indigo-600/50 text-white py-2 px-5 flex items-center gap-2"
                    >
                      Processing...
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
