import { useState } from "react";
import { IoMdClose } from "react-icons/io";
import type { Option } from "../Models/CardProps";
import { Alert } from "./Alert";
import { Cards } from "./Cards";
import { Leftbar } from "./Leftbar";
import MultiTagSelect from "./MultiTagSelect";
import { Topbar } from "./Topbar";

export const Dashboard = () => {
  const [openModal, setOpenModal] = useState(false);
  const [title, setTitle] = useState("");
  const [showAlert, setShowAlert] = useState(false);
  const [desc, setDesc] = useState("");
  const [tags, setTags] = useState<Option[]>([]);
  const [url, setUrl] = useState("");
  const [type, setType] = useState("");

  const createCard = () => {
    console.log(openModal);
    setOpenModal(false);
    setShowAlert(true);
    setTimeout(() => {
      setShowAlert(false);
    }, 2500);
  };
  return (
    <>
      <div
        className={
          openModal
            ? "w-screen h-screen bg-black "
            : "min-w-screen min-h-screen bg-[radial-gradient(1200px_600px_at_top_left,rgba(112,59,247,0.65)_0%,rgba(112,59,247,0.25)_35%,rgba(18,18,18,0)_60%),radial-gradient(1200px_600px_at_bottom_right,rgba(112,59,247,0.65)_0%,rgba(112,59,247,0.25)_35%,rgba(18,18,18,0)_60%),linear-gradient(135deg,#121212_45%,#000_75%)]"
        }
      >
        {showAlert && (
          <Alert
            type="success"
            title="Successfully saved!"
            onClose={() => console.log("Closed")}
          />
        )}
        ;
        <Leftbar />
        <Topbar curr={openModal} setCurr={setOpenModal} />
        <Cards />
        {openModal && (
          <div className="fixed inset-0 bg-custom-gradient bg-black/90 z-40" />
        )}
        {openModal && (
          <div className="fixed  inset-0 flex items-center justify-center z-50">
            <div className="bg-white text-black rounded-xl w-96">
              <div className="header border-b border-gray-400 p-2 font-semibold text-indigo-600 flex justify-between items-center">
                Add Content{" "}
                <IoMdClose
                  size={20}
                  className="cursor-pointer"
                  onClick={() => setOpenModal(false)}
                />
              </div>
              <div className="body py-2 px-4">
                <div className="gap-3 flex flex-col">
                  <div className="border  border-gray-400 flex items-stretch rounded">
                    <input
                      className="w-full focus:outline-none text-indigo-600 login-inputs rounded py-2 px-2"
                      type="text"
                      placeholder="Title..."
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                    />
                  </div>
                  <div className="border border-gray-400 flex items-stretch rounded">
                    <textarea
                      placeholder="Description..."
                      value={desc}
                      onChange={(e) => setDesc(e.target.value)}
                      className="text-indigo-600 add-textArea focus:outline-none rounded w-full py-2 px-2"
                      rows={2}
                    ></textarea>
                  </div>
                  <div className="border  border-gray-400 flex items-stretch rounded">
                    <input
                      type="text"
                      placeholder="content link..."
                      className="w-full focus:outline-none rounded text-indigo-600 login-inputs  py-2 px-2"
                      value={url}
                      onChange={(e) => {
                        setUrl(e.target.value);
                      }}
                    />
                  </div>
                  <div className="border border-gray-400 outline-none flex items-stretch rounded">
                    <select
                      name="type"
                      className="w-full py-2 focus:outline-none px-2 text-indigo-600"
                      value={type}
                      onChange={(event) => setType(event.target.value)}
                    >
                      <option
                        className="w-full text-indigo-600 py-2 px-2"
                        id="0"
                      >
                        youtube
                      </option>
                      <option
                        id="1"
                        className="w-full text-indigo-600 py-2 px-2"
                      >
                        tweet
                      </option>
                    </select>
                  </div>
                  <div className="border  border-gray-400 flex items-stretch rounded">
                    <MultiTagSelect setTagsList={setTags} />
                  </div>
                </div>
              </div>
              <div className="footer flex flex-row-reverse border-t border-gray-400 p-2">
                <button
                  onClick={() => createCard()}
                  className="cursor-pointer py-1 bg-indigo-600 w-28 text-white font-semibold rounded"
                >
                  Add
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};
