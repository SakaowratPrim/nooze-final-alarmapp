import { createBrowserRouter, Navigate } from "react-router";
import Welcome from "./pages/Welcome";
import SignIn from "./pages/SignIn";
import SignUpPage from "./pages/SignUpPage";
import Loading from "./pages/Loading";
import Home from "./pages/Home";
import GoodNight from "./pages/GoodNight";
import Morning from "./pages/Morning";
import Alarm from "./pages/Alarm";
import BuddyPage from "./pages/BuddyPage";
import BuddyProfile from "./pages/BuddyProfile";
import BuddyChat from "./pages/BuddyChat";
import Notifications from "./pages/Notifications";
import History from "./pages/History";
import Account from "./pages/Account";
import { isAuthenticated } from "./utils/auth";

// Protected Route wrapper
function ProtectedRoute({ children }: { children: React.ReactNode }) {
  if (!isAuthenticated()) {
    return <Navigate to="/signin" replace />;
  }
  return <>{children}</>;
}

// Public Route wrapper (redirects to home if already authenticated)
function PublicRoute({ children }: { children: React.ReactNode }) {
  if (isAuthenticated()) {
    return <Navigate to="/home" replace />;
  }
  return <>{children}</>;
}

export const router = createBrowserRouter([
  {
    path: "/",
    element: <PublicRoute><Welcome /></PublicRoute>,
  },
  {
    path: "/signin",
    element: <PublicRoute><SignIn /></PublicRoute>,
  },
  {
    path: "/signup",
    element: <PublicRoute><SignUpPage /></PublicRoute>,
  },
  {
    path: "/loading",
    element: <ProtectedRoute><Loading /></ProtectedRoute>,
  },
  {
    path: "/home",
    element: <ProtectedRoute><Home /></ProtectedRoute>,
  },
  {
    path: "/goodnight",
    element: <ProtectedRoute><GoodNight /></ProtectedRoute>,
  },
  {
    path: "/morning",
    element: <ProtectedRoute><Morning /></ProtectedRoute>,
  },
  {
    path: "/alarm",
    element: <ProtectedRoute><Alarm /></ProtectedRoute>,
  },
  {
    path: "/buddy",
    element: <ProtectedRoute><BuddyPage /></ProtectedRoute>,
  },
  {
    path: "/buddy/:username",
    element: <ProtectedRoute><BuddyProfile /></ProtectedRoute>,
  },
  {
    path: "/chat/:username",
    element: <ProtectedRoute><BuddyChat /></ProtectedRoute>,
  },
  {
    path: "/notifications",
    element: <ProtectedRoute><Notifications /></ProtectedRoute>,
  },
  {
    path: "/history",
    element: <ProtectedRoute><History /></ProtectedRoute>,
  },
  {
    path: "/account",
    element: <ProtectedRoute><Account /></ProtectedRoute>,
  },
]);
