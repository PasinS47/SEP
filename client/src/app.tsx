import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useState } from "react";
import Home from "@/pages/home.tsx";
import Login from "@/pages/login.tsx";
import Profile from "@/pages/profile.tsx";
import Callback from "@/pages/callback.tsx";
import Calendar from "@/pages/calendar";
import Register from "@/pages/register";
import Share from "./pages/share";
import { Navbar } from "@/components/navbar.tsx";
import { useUser } from "@/hooks/use-user.ts";
import { ThemeProvider } from "@/components/theme-provider.tsx";
import { NavigationListener } from "@/components/navigate-listener";

export default function App() {
  const { user, setUser, loading, reload } = useUser();
  const [isLoggedOut, setIsLoggedOut] = useState(false);

  if (loading) return <p>Loading...</p>;

  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <BrowserRouter>
        <NavigationListener user={user} reload={reload} />
        <Navbar user={user} setUser={setUser} setIsLoggedOut={setIsLoggedOut} />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/auth/callback" element={<Callback reload={reload} />} />
          <Route
            path="/profile"
            element={
              <Profile
                user={user}
                setUser={setUser}
                isLoggedOut={isLoggedOut}
                setIsLoggedOut={setIsLoggedOut}
              />
            }
          />
          <Route path="/register" element={<Register />} />
          <Route
            path="/calendar"
            element={<Calendar user={user} setUser={setUser} />}
          />
          <Route
            path="/share/:lnk"
            element={<Share user={user} setUser={setUser} />}
          />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}
