import { createBrowserRouter, Navigate } from "react-router-dom";
import App from "./App.tsx";
import { Application } from "./pages/application/Application.tsx";
import { External } from "./pages/external/External.tsx";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      { index: true, element: <Navigate to="/application/external" replace /> },
      { path: "application/external", element: <Application /> },
      { path: "external/active", element: <External /> },
    ],
  },
]);
