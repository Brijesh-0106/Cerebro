import { Route, Routes } from "react-router-dom";
import "./App.css";
import { Cards } from "./Components/Cards";
import { Dashboard } from "./Components/Dashboard";
import { Login } from "./Components/Login";
import { SignIn } from "./Components/SignIn";
import Thoughts from "./Components/Thoughts";

import Articles from "./Components/Articles";
import { ChatWithAI } from "./Components/ChatWithAI";
import LandingPage from "./Components/LandingPage";
import Tweets from "./Components/Tweets";
import Youtube from "./Components/Youtube";

import { useEffect } from "react";
import { useRecoilValue } from "recoil";
import { ThemeAtom } from "./Recoil/ThemeAtom";

function App() {
  const theme = useRecoilValue(ThemeAtom);

  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
    localStorage.setItem("theme", theme);
  }, [theme]);

  return (
    <>
      <Routes>
        <Route path="*" element={<LandingPage />}></Route>
        <Route path="/signin" element={<SignIn />}></Route>
        <Route path="/login" element={<Login />}></Route>
        <Route path="/dashboard/*" element={<Dashboard />}>
          <Route path="all-content" index element={<Cards />} />
          <Route path="thoughts" element={<Thoughts />} />
          <Route path="youtube-content" element={<Youtube />} />
          <Route path="tweeter-content" element={<Tweets />} />
          <Route path="article-content" element={<Articles />} />
          <Route path="chat-with-ai" element={<ChatWithAI />} />
        </Route>
      </Routes>
    </>
  );
}

export default App;
