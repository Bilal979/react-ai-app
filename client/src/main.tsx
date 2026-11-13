import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { BrowserRouter } from "react-router-dom";
import ThemeProvider from './context/ThemeContext.tsx'
import ApiKeyProvider from "./context/ApiKeyContext.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ThemeProvider>
      <ApiKeyProvider>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </ApiKeyProvider>
    </ThemeProvider>

  </StrictMode>,
);
