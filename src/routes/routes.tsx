import type { RouteType } from "../types/routes";  // <-- 'import type' use karo
import Home from "../pages/Home";
import Login from "../pages/Login";
import Signup from "../pages/Signup";
import Dashboard from "../pages/Dashboard";
import ProfilePage from "../pages/Profile";
import HomeworkUploadPage from "../pages/UploadWork";

const routes: RouteType[] = [
  { path: "/", element: <Home /> },
  { path: "/login", element: <Login /> },
  { path: "/signup", element: <Signup /> },
  { path: "/dashboard", element: <Dashboard /> },
  { path: "/profile", element: <ProfilePage /> },
  { path: "/upload-homework", element: <HomeworkUploadPage /> },
];

export default routes;
