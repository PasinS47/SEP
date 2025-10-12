import { loginWithGoogle } from "../api.ts";

export default function Login() {
    return (
        <div className="p-8 text-center">
            <h1 className="text-2xl mb-4">Sign in</h1>
            <button
                onClick={loginWithGoogle}
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
                Sign in with Google
            </button>
        </div>
    );
}