import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { logout } from "@/lib/api.ts";
import { toast } from "sonner";
import { useState } from "react";

export function Navbar({
  user,
  setUser,
  setIsLoggedOut,
}: {
  user: any;
  setUser: (u: any) => void;
  setIsLoggedOut: (u: any) => void;
}) {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleLogout = async () => {
    setIsLoggedOut(true);
    setLoading(true);
    await logout();
    setUser(null);
    setLoading(false);
    toast.success("Logged out successfully");
    navigate("/");
  };

  return (
    <nav className="flex justify-between items-center px-4 py-3 border-b bg-background sticky top-0 z-50">
      <Link to="/" className="font-semibold text-lg text-foreground">
        🎓 Student Event Planner
      </Link>
      <div>
        {user ? (
          <div className="flex items-center gap-x-4">
            <Link className="text-sm text-foreground" to="/profile">
              {user.name}
            </Link>
            <Button variant="outline" size="sm" onClick={handleLogout}>
              {loading ? "Logging out..." : "Logout"}
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
