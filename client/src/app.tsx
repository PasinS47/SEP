import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "@/pages/home.tsx";
import Login from "@/pages/login.tsx";
import Profile from "@/pages/profile.tsx";
import Callback from "@/pages/callback.tsx";
import Register from "@/pages/register";
import { Navbar } from "@/components/navbar.tsx";
import { useUser } from "@/hooks/use-user.ts";
import { ThemeProvider } from "@/components/theme-provider.tsx";

export default function App() {
  const { user, setUser, loading, reload } = useUser();

  if (loading) return <p>Loading...</p>;

  return (
    <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
      <BrowserRouter>
        <Navbar user={user} setUser={setUser} />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/auth/callback" element={<Callback reload={reload} />} />
          <Route
            path="/profile"
            element={<Profile user={user} setUser={setUser} />}
          />
          <Route path="/register" element={<Register />} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}
