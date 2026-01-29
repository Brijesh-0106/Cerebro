import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import { Dashboard } from "./Components/Dashboard";
import { Login } from "./Components/Login";
import { SignIn } from "./Components/SignIn";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="*" element={<SignIn />}></Route>
        <Route path="/login" element={<Login />}></Route>
        <Route path="/dashboard" element={<Dashboard />}></Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
