import { useEffect, useState } from "react";
import { fetchMe } from "@/lib/api.ts";

export function useUser() {
    const [user, setUser] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    async function reload(background = false) {
        if (!background)
            setLoading(true);
        try {
            const res = await fetchMe();
      
            if (res?.success) {
                setUser(res.user);
            } else {
                setUser(null);
            }
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        reload(true);
    }, []);

    return { user, setUser, loading, reload };
}