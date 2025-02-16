// main.jsx

import ReactDOM from "react-dom/client";
import { ClerkProvider } from "@clerk/clerk-react";
import App from "./App";

const clerkFrontendApi = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY; // Ensure this variable exists in your .env

ReactDOM.createRoot(document.getElementById("root")).render(
  <ClerkProvider publishableKey={clerkFrontendApi}>
    <App />
  </ClerkProvider>
);
