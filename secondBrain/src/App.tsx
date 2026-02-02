import { Route, Routes } from "react-router-dom";
import "./App.css";
import { Cards } from "./Components/Cards";
import { Dashboard } from "./Components/Dashboard";
import { Login } from "./Components/Login";
import { SignIn } from "./Components/SignIn";
import Thoughts from "./Components/Thoughts";

function App() {
  return (
    <>
      <Routes>
        <Route path="*" element={<SignIn />}></Route>
        <Route path="/login" element={<Login />}></Route>
        <Route path="/dashboard/*" element={<Dashboard />}>
          <Route path="all-content" index element={<Cards />} />
          <Route path="thoughts" element={<Thoughts />} />
        </Route>
      </Routes>
      {/* <Routes>
      </Routes> */}
    </>
  );
}

export default App;
