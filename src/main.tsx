import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import { AppProvider } from "./context/AppContext";
import { BrowserRouter } from "react-router";
import "./index.css";


createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <AppProvider>
      <BrowserRouter basename={import.meta.env.BASE_URL}>
          <App />
      </BrowserRouter>
    </AppProvider>
  </StrictMode>,
);
