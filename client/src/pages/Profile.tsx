import {fetchProfile, logout} from "../api.ts";
import { useNavigate } from "react-router-dom";
import {useEffect, useState} from "react";

export default function Profile({
    user,
    setUser
}: {
    user: any;
    setUser: (u: any) => void;
}) {
    const [profile, setProfile] = useState<any>(null);
    const navigate = useNavigate();

    useEffect(() => {
        if (!user) {
            navigate("/login");
            return;
        }
        (async () => {
            const res = await fetchProfile();
            if (res?.success) setProfile(res.user);
            else navigate("/login");
        })();
    }, [user, navigate])

    const handleLogout = async () => {
        await logout();
        setUser(null);
        navigate("/");
    };

    if (!profile) return <p className="text-center mt-10">Loading profile...</p>;

    return (
        <div className="p-8 text-center">
            <img
                src={profile.picture}
                alt={profile.name}
                className="rounded-full mx-auto w-24 h-24"
                referrerPolicy="no-referrer"
            />
            <h2 className="text-xl font-semibold mt-4">{profile.name}</h2>
            <p className="text-gray-600">{profile.email}</p>
            <p className="mt-2 text-sm text-gray-500">
                Member since: {new Date(profile.memberSince ?? profile.createdAt).toLocaleDateString()}
            </p>

            <button
                onClick={handleLogout}
                className="mt-6 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
            >
                Logout
            </button>
        </div>
    );
}