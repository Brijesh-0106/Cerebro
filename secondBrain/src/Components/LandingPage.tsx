import { useEffect, useRef, useState } from "react";
import { FaGoogle } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import GoogleSignIn from "./GoogleSignIn";
import Navbar from "./Navbar/Navbar";
const PAIRS = [
  ["Save everything,", "Find anything"],
  ["Your content,", "Your AI assistant"],
  ["Stop searching,", "Start asking"],
  ["Bookmark smarter,", "Remember better"],
  ["Scattered content,", "Unified intelligence"],
  ["Save once,", "Search forever"],
  ["Lost bookmarks,", "Found answers"],
  ["Collect knowledge,", "Chat with it"],
  ["Your second brain,", "Powered by AI"],
];
const AIAnswers = [
  [
    "What is CereBro?",
    "CereBro is your AI-powered second brain that organizes and retrieves your saved content with ease.",
  ],
  [
    "How does it help?",
    "It helps you save everything in one place and find anything you need, making your life more efficient and organized.",
  ],
];
export default function LandingPage() {
  const [aiLine0, setAiLine0] = useState(""); // Q1
  const [aiLine1, setAiLine1] = useState(""); // A1
  const [aiLine2, setAiLine2] = useState(""); // Q2
  const [aiLine3, setAiLine3] = useState(""); // A2
  const [line1, setLine1] = useState("");
  const [line2, setLine2] = useState("");
  const googleButtonRef = useRef<HTMLDivElement>(null);
  const [pairIndex, setPairIndex] = useState(0);
  const [landEmail, setLandEmail] = useState("");
  const [showCursor, setShowCursor] = useState(true);
  const [showsecondQ, setShowsecondQ] = useState(false);
  const [showFirstQ, setShowFirstQ] = useState(false);

  // Typewriter effect for landing page headline
  useEffect(() => {
    let cancelled = false;
    const pair = PAIRS[pairIndex];

    const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

    const typeText = async (text: string, setter: (v: string) => void) => {
      for (let i = 0; i <= text.length; i++) {
        if (cancelled) return;
        setter(text.slice(0, i));
        await sleep(80);
      }
    };

    const deleteText = async (text: string, setter: (v: string) => void) => {
      for (let i = text.length; i >= 0; i--) {
        if (cancelled) return;
        setter(text.slice(0, i));
        await sleep(40);
      }
    };

    const run = async () => {
      // Type line 1
      await typeText(pair[0], setLine1);
      await sleep(300);

      // Type line 2
      await typeText(pair[1], setLine2);
      await sleep(2000);

      // Delete line 2 first
      await deleteText(pair[1], setLine2);
      await sleep(100);

      // Delete line 1
      await deleteText(pair[0], setLine1);
      await sleep(300);

      // Move to next pair
      if (!cancelled) {
        setPairIndex((prev) => (prev + 1) % PAIRS.length);
      }
    };
    run();
    return () => {
      cancelled = true;
    };
  }, [pairIndex]);

  // Punch Lines for AI answers
  useEffect(() => {
    let cancelled = false;

    const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

    const typeText = async (text: string, setter: (v: string) => void) => {
      for (let i = 0; i <= text.length; i++) {
        if (cancelled) return;
        setter(text.slice(0, i));
        await sleep(20 + Math.random() * 40);
      }
    };

    const run = async () => {
      // RESET
      setAiLine0("");
      setAiLine1("");
      setAiLine2("");
      setAiLine3("");

      setShowFirstQ(false);
      setShowsecondQ(false);
      // -------- FIRST Q&A --------

      await sleep(1200);
      setAiLine0(AIAnswers[0][0]); // Q1
      setShowFirstQ(true);
      await sleep(600);

      await typeText(AIAnswers[0][1], setAiLine1); // A1

      await sleep(1200);
      setAiLine2(AIAnswers[1][0]); // Q2
      setShowsecondQ(true);
      // -------- SECOND Q&A --------
      await sleep(600);

      await typeText(AIAnswers[1][1], setAiLine3); // A2
    };

    run();

    return () => {
      cancelled = true;
    };
  }, []);
  const [errorGoogle, setErrorGoogle] = useState("");
  const nav = useNavigate();
  // Blinking cursor
  useEffect(() => {
    const cursor = setInterval(() => {
      setShowCursor((prev) => !prev);
    }, 500);
    return () => clearInterval(cursor);
  }, []);
  const handleGoogleSuccess = (user: Record<string, unknown>) => {
    console.log("Signed in successfully:", user);
    // Redirect to dashboard or home
    nav("/dashboard/all-content");
  };

  const handleGoogleError = (error: string) => {
    setErrorGoogle(error);
  };
  const handleCustomButtonClick = () => {
    const googleButton =
      googleButtonRef.current?.querySelector('div[role="button"]');
    console.log(googleButton);
    if (googleButton) {
      (googleButton as HTMLElement).click();
    }
  };
  const navWithEmail = () => {
    nav("/login", { state: { landEmail } });
  };
  return (
    <>
      <Navbar />
      <div className="hero-section flex h-[calc(100vh-7vh)] px-18 bg-black">
        <div className="leftSignInPart h-full w-1/2 flex justify-center items-center">
          <div className="flex  w-96.25  flex-col items-center justify-center">
            <div className="text-center">
              <h1 className="text-4xl h-20 text-[#4f39f6] font-bold">
                {/* Line 1 */}
                <span>{line1}</span>
                {/* Cursor only on line 1 if line 2 is empty */}
                {line2 === "" && (
                  <span className={showCursor ? "opacity-100" : "opacity-0"}>
                    |
                  </span>
                )}
                <br />
                {/* Line 2 */}
                <span>{line2}</span>
                {/* Cursor on line 2 when it's typing */}
                {line2 !== "" && (
                  <span className={showCursor ? "opacity-100" : "opacity-0"}>
                    |
                  </span>
                )}
              </h1>
              <h2 className="text-[#faf9f5] text-xl mt-4">
                Your future self will thank you for this
              </h2>
            </div>
            {errorGoogle && <div className="error-message">{errorGoogle}</div>}
            <div className="not-odd mt-4 px-4 py-8 border w-full flex flex-col rounded-4xl justify-center items-center border-zinc-700 dummyButton">
              <button
                onClick={handleCustomButtonClick}
                className="cursor-pointer text-lg rounded-lg justify-center w-80 bg-indigo-600 text-center text-white flex py-2 px-3 items-center gap-2"
              >
                <FaGoogle size={24} /> Login with Google
              </button>
              <div ref={googleButtonRef} style={{ display: "none" }}>
                <GoogleSignIn
                  onSuccess={handleGoogleSuccess}
                  onError={handleGoogleError}
                />
              </div>
              <h4 className="text-zinc-400 text-center my-4">OR</h4>
              <div>
                <input
                  type="text"
                  onChange={(e) => setLandEmail(e.target.value)}
                  className="bg-zinc-900 mb-4 border border-zinc-500 placeholder-gray-300::placeholder text-zinc-100 text-lg px-4 py-3 w-80 rounded-lg"
                  placeholder="Enter your email"
                />
                <button
                  className="bg-[#faf9f5] w-80 text-center justify-center cursor-pointer flex py-2 px-3 gap-1 text-lg items-center rounded-lg"
                  onClick={() => navWithEmail()}
                >
                  Continue with Email
                </button>
              </div>
            </div>
          </div>
        </div>
        <div className="rightVideoSection pr-2 ml-20 py-18 h-full w-1/2">
          <div className="w-full h-full bg-zinc-900 border-zinc-500 border p-8 flex flex-col rounded-2xl">
            <span className="text-white text-center text-md py-2 px-3  mx-auto mt-2 rounded-2xl  border border-zinc-500">
              How to Use?
            </span>
            <div className="mt-8">
              {showFirstQ && (
                <>
                  <div
                    className={`ml-auto rounded-xl max-w-lg p-3 w-fit mb-4 text-white bg-indigo-600 
                    transition-all duration-700 ease-out 
                    ${
                      showFirstQ
                        ? "opacity-100 translate-y-0 scale-100"
                        : "opacity-0 translate-y-6 scale-90"
                    }`}
                  >
                    {aiLine0}
                  </div>
                  {!aiLine1 && showFirstQ && (
                    <div className="text-gray-500 text-sm animate-pulse">
                      Thinking...
                    </div>
                  )}
                  {aiLine1 && (
                    <div className="text-gray-500 text-sm">
                      Searched 3 sources &gt;
                    </div>
                  )}
                  <div className="text-zinc-300 min-h-16">
                    {aiLine1}
                    {!showsecondQ && (
                      <span
                        className={showCursor ? "opacity-100" : "opacity-0"}
                      >
                        |
                      </span>
                    )}
                  </div>
                </>
              )}
              {showsecondQ && (
                <>
                  {showsecondQ && (
                    <div
                      className={`ml-auto rounded-xl max-w-lg p-3 mt-4 mb-4 w-fit text-white bg-indigo-600 
                      transition-all duration-700 ease-out 
                      ${
                        showFirstQ
                          ? "opacity-100 translate-y-0 scale-100"
                          : "opacity-0 translate-y-6 scale-90"
                      }`}
                    >
                      {aiLine2}
                    </div>
                  )}
                  {!aiLine3 && showsecondQ && (
                    <div className="text-gray-500 text-sm animate-pulse">
                      Thinking...
                    </div>
                  )}{" "}
                  {aiLine3 && (
                    <div className="text-gray-500 text-sm">
                      Searched 3 sources &gt;
                    </div>
                  )}
                  <div className="text-zinc-300 min-h-16">{aiLine3}</div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
