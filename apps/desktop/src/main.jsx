import { createRoot } from "react-dom/client";
import App from "./app";
import "./app.css";

const container = document.getElementById("root");
const root = createRoot(container);

root.render(<App />);
