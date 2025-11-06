const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

export async function fetchMe() {
    const response = await fetch(`${API_URL}/api/auth/me`, {
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
    const response = await fetch(`${API_URL}/api/profile`, {
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
    // console.log(JSON.stringify(data))
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
