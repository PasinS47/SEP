import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { logout } from "@/lib/api.ts";

export function Navbar({user, setUser}: { user: any; setUser: (u: any) => void; }) {
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    setUser(null);
    navigate("/");
  }

  return (
    <nav className="flex justify-between items-center px-4 py-3 border-b bg-background sticky top-0 z-50">
      <Link to="/" className="font-semibold text-lg text-foreground">
        🎓 Student Event Planner
      </Link>
      <div>
        {user ? (
          <div className="flex items-center gap-x-4">
            <span className="text-sm text-foreground">{user.name}</span>
            <Button variant="outline" size="sm" onClick={handleLogout}>
              Logout
            </Button>
          </div>
        ) : (
          <Button size="sm">
            <Link to="/login">Login</Link>
          </Button>
        )}
      </div>
    </nav>
  );
}
