import { toast } from "sonner";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

async function fetchWithInterceptor(
    url: string,
    options?: RequestInit
): Promise<Response> {
    const response = await fetch(url, options);

    // Check for custom warning headers
    const tokenWarning = response.headers.get("X-Token-Warning");
    const tokenRemaining = response.headers.get("X-Token-Remaining");

    if (tokenWarning) {
        const remainingSeconds = tokenRemaining ? parseInt(tokenRemaining) : 0;
        toast.warning(`⚠️ ${tokenWarning}`, {
            description: remainingSeconds
                ? `Session expires in ${remainingSeconds} seconds`
                : undefined,
            duration: 4000,
        });
    }

    return response;
}


export async function fetchMe() {
    const response = await fetchWithInterceptor(`${API_URL}/api/auth/me`, {
        credentials: "include",
    });
    return response.json();
}

export async function logout() {
    const response = await fetch(`${API_URL}/api/auth/logout`, {
        method: "POST",
        credentials: "include",
    });
    return response.json();
}

export async function fetchProfile() {
    const response = await fetchWithInterceptor(`${API_URL}/api/profile`, {
        credentials: "include",
    });
    return response.json();
}

export function loginWithGoogle() {
    window.location.href = `${API_URL}/auth/google`;
}
//add event call backend api
export async function CalenAddEvent(eventName: string, date: string, end: string) {
    const data = { eventName: eventName, date: date, end: end }
    console.log(JSON.stringify(data))
    const response = await fetch(`${API_URL}/api/addEvent`, {
        method: "POST",
        credentials: "include",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data)
    });
    return response
}
//get event call backend api
export async function CalenGetEvent() {
    const response = await fetch(`${API_URL}/api/getEvent`, {
        credentials: "include",
    })
    return response.json()
}
export async function delEvent(title: string, date: string) {
    const data = { title: title, date: date }
    const response = await fetch(`${API_URL}/api/delEvent`, {
        method: "POST",
        credentials: "include",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data)
    })
    return response
}

export async function loginWithEmail(email: string, password: string) {
    const response = await fetch(`${API_URL}/api/auth/login`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
    });
    return response.json();
}

export async function registerAccount(name: string, email: string, password: string) {
    const response = await fetch(`${API_URL}/api/auth/register`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
    });
    return response.json();
}
export async function checkVisited(lnk: string) {
    const response = await fetch(`${API_URL}/api/checkvisit`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sharelink: lnk }),

    })
    return response
}
export async function createShareLink() {
    const response = await fetch(`${API_URL}/api/createshare`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
    })
    return response
}
export async function getGroupEvent(lnk:string) {
    const response = await fetch(`${API_URL}/api/getgroupevent`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body :JSON.stringify({sharelink: lnk })
    })
    return response
}