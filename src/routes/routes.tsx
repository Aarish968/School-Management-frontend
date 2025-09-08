import type { RouteType } from "../types/routes";  // <-- 'import type' use karo
import Home from "../pages/Home";
import Login from "../pages/Login";
import Signup from "../pages/Signup";
import Dashboard from "../pages/Dashboard";
import ProfilePage from "../pages/Profile";
import HomeworkUploadPage from "../pages/UploadWork";
import ProtectedRoute from "./ProtectedRoute";
import GuestRoute from "./GuestRoute";

const routes: RouteType[] = [
  { path: "/", element: <Home /> },
  { path: "/login", element: <GuestRoute><Login /></GuestRoute> },
  { path: "/signup", element: <GuestRoute><Signup /></GuestRoute> },
  { path: "/dashboard", element: <ProtectedRoute><Dashboard /></ProtectedRoute> },
  { path: "/profile", element: <ProtectedRoute><ProfilePage /></ProtectedRoute> },
  { path: "/upload-homework", element: <ProtectedRoute><HomeworkUploadPage /></ProtectedRoute> },
];

export default routes;
