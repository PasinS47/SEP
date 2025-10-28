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