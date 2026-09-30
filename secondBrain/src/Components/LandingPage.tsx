import { useEffect, useRef, useState } from "react";
import { FaGoogle } from "react-icons/fa";
import { HiArrowRight } from "react-icons/hi2";
import { MdOutlineAttachEmail } from "react-icons/md";
import { Link, useNavigate } from "react-router-dom";
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
    "CereBro is your AI-powered second brain that organizes and retrieves your saved content with ease✨.",
  ],
  [
    "How does it help?",
    "It helps you save everything in one place and find anything you need, making your life more efficient and organized✨.",
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
  const [errorGoogle, setErrorGoogle] = useState("");
  const nav = useNavigate();

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
      await sleep(800);

      await typeText(AIAnswers[0][1], setAiLine1); // A1

      await sleep(1200);
      setAiLine2(AIAnswers[1][0]); // Q2
      setShowsecondQ(true);
      // -------- SECOND Q&A --------
      await sleep(800);

      await typeText(AIAnswers[1][1], setAiLine3); // A2
    };

    run();

    return () => {
      cancelled = true;
    };
  }, []);

  // Blinking cursor
  useEffect(() => {
    const cursor = setInterval(() => {
      setShowCursor((prev) => !prev);
    }, 500);
    return () => clearInterval(cursor);
  }, []);

  const handleGoogleSuccess = (user: Record<string, unknown>) => {
    console.log("Signed in successfully:", user);
    nav("/dashboard/all-content");
  };

  const handleGoogleError = (error: string) => {
    setErrorGoogle(error);
  };

  const handleCustomButtonClick = () => {
    const googleButton =
      googleButtonRef.current?.querySelector('div[role="button"]');
    if (googleButton) {
      (googleButton as HTMLElement).click();
    }
  };

  const navWithEmail = () => {
    nav("/login", { state: { landEmail } });
  };

  return (
    <div className="min-h-screen bg-canvas-grid text-zinc-900 dark:text-zinc-100 flex flex-col transition-colors duration-200 relative overflow-x-hidden">
      {/* Subtle ambient lighting behind hero */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-gradient-to-tr from-indigo-500/10 via-purple-500/10 to-transparent blur-3xl pointer-events-none -z-10 rounded-full" />

      <Navbar />

      <main className="hero-section flex-1 flex flex-col md:flex-row items-center justify-center px-4 sm:px-8 lg:px-16 py-8 sm:py-12 gap-10 lg:gap-14 max-w-7xl mx-auto w-full">
        {/* ── Left Hero & Auth Section ── */}
        <div className="leftSignInPart w-full md:w-1/2 flex flex-col items-center md:items-start text-center md:text-left max-w-lg">
          {/* Dynamic Typwriting Headline */}
          <h1 className="text-3xl sm:text-4xl lg:text-4xl font-extrabold tracking-tight min-h-[5.5rem] flex flex-col justify-center leading-tight">
            <span className="text-zinc-900 dark:text-white drop-shadow-xs">
              {line1 || "\u00A0"}
            </span>
            <span className="bg-gradient-to-r from-indigo-600 via-indigo-500 to-purple-600 dark:from-indigo-400 dark:via-purple-300 dark:to-indigo-300 bg-clip-text text-transparent">
              {line2 || "\u00A0"}
              <span
                className={`inline-block ml-1 font-normal text-indigo-500 ${showCursor ? "opacity-100" : "opacity-0"}`}
              >
                |
              </span>
            </span>
          </h1>

          <p className="text-zinc-600 dark:text-zinc-400 text-sm sm:text-base mt-3 max-w-md leading-relaxed">
            Your personal digital vault for YouTube videos, tweets, articles,
            and thoughts. Never lose an idea again.
          </p>

          {errorGoogle && (
            <div className="error-message w-full mt-4">{errorGoogle}</div>
          )}

          {/* ── Modern Auth Card ── */}
          <div className="mt-4 w-4/5 bg-white/80 dark:bg-[#12141e]/80 backdrop-blur-xl border border-zinc-200/90 dark:border-zinc-800/90 rounded-3xl p-6 sm:p-7 shadow-xl shadow-indigo-500/5 dark:shadow-2xl dark:shadow-black/60 transition-all duration-300 hover:border-indigo-500/40 group">
            {/* Google Sign In */}
            <button
              onClick={handleCustomButtonClick}
              className="w-full cursor-pointer text-sm sm:text-base font-semibold rounded-xl justify-center bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white flex py-3 px-4 items-center gap-3 transition-all duration-200 shadow-md shadow-indigo-600/25 hover:shadow-lg hover:shadow-indigo-600/35 hover:-translate-y-0.5 active:translate-y-0"
            >
              <FaGoogle size={18} /> Continue with Google
            </button>
            <div ref={googleButtonRef} style={{ display: "none" }}>
              <GoogleSignIn
                onSuccess={handleGoogleSuccess}
                onError={handleGoogleError}
              />
            </div>

            {/* Divider */}
            <div className="relative flex items-center justify-center my-4 w-full">
              <div className="w-full border-t border-zinc-200 dark:border-zinc-800" />
              <span className="absolute px-3 bg-white/95 dark:bg-[#12141e] text-[11px] font-medium uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
                or with email
              </span>
            </div>

            {/* Email Quick-Start Form */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                navWithEmail();
              }}
              className="w-full flex flex-col gap-3"
            >
              <div className="relative w-full">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-zinc-400">
                  <MdOutlineAttachEmail size={18} />
                </div>
                <input
                  type="email"
                  value={landEmail}
                  onChange={(e) => setLandEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="w-full pl-10 pr-4 py-2.5 bg-zinc-50/90 dark:bg-zinc-900/90 border border-zinc-200 dark:border-zinc-700/80 rounded-xl text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-500 transition-all"
                />
              </div>
              <button
                type="submit"
                className="w-full cursor-pointer flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-zinc-900 hover:bg-zinc-800 dark:bg-zinc-100 dark:hover:bg-white text-white dark:text-zinc-900 font-semibold text-sm transition-all shadow-sm hover:shadow hover:-translate-y-0.5 active:translate-y-0"
              >
                Continue with Email
                <HiArrowRight size={16} />
              </button>
            </form>

            {/* Benefits Row */}
            {/* <div className="mt-4 pt-4 border-t border-zinc-100 dark:border-zinc-800/80 flex items-center justify-between text-xs text-zinc-500 dark:text-zinc-400">
              <span className="flex items-center gap-1">✦ Free forever</span>
            </div> */}
          </div>

          {/* Already have an account */}
          <div className="mt-4 text-xs sm:text-sm text-zinc-600 dark:text-zinc-400">
            Already have an account?{" "}
            <Link
              to="/login"
              className="font-semibold text-indigo-600 dark:text-indigo-400 hover:underline"
            >
              Log in
            </Link>
          </div>
        </div>

        {/* ── Right Preview / Chat Demo Section ── */}
        <div className="rightVideoSection w-full md:w-1/2 flex justify-center">
          <div className="relative w-full max-w-lg bg-white/80 dark:bg-[#12141e]/80 backdrop-blur-xl border border-zinc-200/90 dark:border-zinc-800/90 p-6 sm:p-8 flex flex-col rounded-3xl shadow-xl shadow-indigo-500/5 dark:shadow-2xl dark:shadow-black/60 transition-all duration-300 min-h-[380px] sm:min-h-[420px]">
            {/* Header pill */}
            <div className="inline-flex items-center gap-2 text-zinc-800 dark:text-zinc-200 text-xs font-semibold py-1.5 px-3.5 mx-auto rounded-full bg-zinc-100 dark:bg-zinc-800/80 border border-zinc-200 dark:border-zinc-700/80 shadow-xs">
              Chat with your Saved Knowledge
            </div>

            {/* Interactive Chat Stream */}
            <div className="mt-6 flex flex-col gap-4 flex-1">
              {showFirstQ && (
                <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
                  <div className="ml-auto rounded-2xl rounded-tr-xs max-w-xs sm:max-w-sm p-3 px-4 w-fit mb-2 text-white bg-indigo-600 text-sm font-medium shadow-sm">
                    {aiLine0}
                  </div>
                  {!aiLine1 && (
                    <div className="text-zinc-400 text-xs flex items-center gap-1.5 py-1">
                      <span className="w-2 h-2 rounded-full bg-indigo-500 animate-ping inline-block" />
                      Searching your library...
                    </div>
                  )}
                  {aiLine1 && (
                    <div className="text-indigo-500 dark:text-indigo-400 text-xs font-medium mb-1">
                      ✓ Searched 3 sources
                    </div>
                  )}
                  <div className="text-zinc-800 dark:text-zinc-200 text-sm leading-relaxed bg-zinc-50 dark:bg-zinc-900/60 p-3.5 rounded-2xl rounded-tl-xs border border-zinc-200/60 dark:border-zinc-800/60">
                    {aiLine1}
                    {!showsecondQ && (
                      <span
                        className={`inline-block ml-0.5 text-indigo-500 font-bold ${showCursor ? "opacity-100" : "opacity-0"}`}
                      >
                        |
                      </span>
                    )}
                  </div>
                </div>
              )}

              {showsecondQ && (
                <div className="animate-in fade-in slide-in-from-bottom-2 duration-300 mt-2">
                  <div className="ml-auto rounded-2xl rounded-tr-xs max-w-xs sm:max-w-sm p-3 px-4 w-fit mb-2 text-white bg-indigo-600 text-sm font-medium shadow-sm">
                    {aiLine2}
                  </div>
                  {!aiLine3 && (
                    <div className="text-zinc-400 text-xs flex items-center gap-1.5 py-1">
                      <span className="w-2 h-2 rounded-full bg-indigo-500 animate-ping inline-block" />
                      Synthesizing answers...
                    </div>
                  )}
                  {aiLine3 && (
                    <div className="text-indigo-500 dark:text-indigo-400 text-xs font-medium mb-1">
                      ✓ Searched 3 sources
                    </div>
                  )}
                  <div className="text-zinc-800 dark:text-zinc-200 text-sm leading-relaxed bg-zinc-50 dark:bg-zinc-900/60 p-3.5 rounded-2xl rounded-tl-xs border border-zinc-200/60 dark:border-zinc-800/60">
                    {aiLine3}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
