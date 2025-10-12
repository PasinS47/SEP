import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home.tsx";
import Login from "./pages/Login.tsx";
import Profile from "./pages/Profile.tsx";
import Callback from "./pages/Callback.tsx";
import { Navbar } from "./components/Navbar.tsx";
import { useUser } from "./hooks/useUser.ts";

export default function App() {
    const { user, setUser, loading, reload } = useUser();

    if (loading) return <p>Loading...</p>;

    return (
        <BrowserRouter>
            <Navbar user={user}/>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/auth/callback" element={<Callback reload={reload} />} />
                <Route path="/profile" element={<Profile user={user} setUser={setUser}/>} />
            </Routes>
        </BrowserRouter>
    )
}