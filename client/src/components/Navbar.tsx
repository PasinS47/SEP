import { Link } from "react-router-dom";

export function Navbar({ user }: { user?: any }) {
    return (
        <nav className="flex items-center justify-between p-4 bg-gray-100 shadow">
            <Link to="/" className="font-bold text-lg text-blue-600">
                🎓 Student Event Planner
            </Link>
            <div>
                {user ? (
                    <Link to="/profile" className="text-gray-700 hover:text-blue-600">
                        {user.name}
                    </Link>
                ) : (
                    <Link to="/login" className="text-gray-700 hover:text-blue-600">
                        Login
                    </Link>
                )}
            </div>
        </nav>
    );
}