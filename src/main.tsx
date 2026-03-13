import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { AuthProvider } from "./contexts/AuthContext";
import { DestinationProvider } from "./contexts/DestinationContext";

createRoot(document.getElementById("root")!).render(<App />);
