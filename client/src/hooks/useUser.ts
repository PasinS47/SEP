import { useEffect, useState } from "react";
import { fetchMe } from "../api.ts";

export function useUser() {
    const [user, setUser] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    async function reload() {
        setLoading(true);
        try {
            const res = await fetchMe();
            if (res?.success) setUser(res.user);
            else setUser(null);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        reload();
    }, []);

    return { user, setUser, loading, reload };
}