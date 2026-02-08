import "react-loading-skeleton/dist/skeleton.css";
import { Route, Routes } from "react-router-dom";
import "./App.css";
import { Cards } from "./Components/Cards";
import { Dashboard } from "./Components/Dashboard";
import { Login } from "./Components/Login";
import { SignIn } from "./Components/SignIn";
import Thoughts from "./Components/Thoughts";

import { ChatWithAI } from "./Components/ChatWithAI";
import Tweets from "./Components/Tweets";
import Youtube from "./Components/Youtube";

function App() {
  return (
    <>
      <Routes>
        <Route path="*" element={<SignIn />}></Route>
        <Route path="/login" element={<Login />}></Route>
        <Route path="/dashboard/*" element={<Dashboard />}>
          <Route path="all-content" index element={<Cards />} />
          <Route path="thoughts" element={<Thoughts />} />
          <Route path="youtube-content" element={<Youtube />} />
          <Route path="tweeter-content" element={<Tweets />} />
          <Route path="chat-with-ai" element={<ChatWithAI />} />
        </Route>
      </Routes>
    </>
  );
}

export default App;
