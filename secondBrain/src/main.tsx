import { GoogleOAuthProvider } from "@react-oauth/google";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { RecoilRoot } from "recoil";
import App from "./App";

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;
ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
    <BrowserRouter>
      <RecoilRoot>
        <App />
      </RecoilRoot>
    </BrowserRouter>
  </GoogleOAuthProvider>,
);
