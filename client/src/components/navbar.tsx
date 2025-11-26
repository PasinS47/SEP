import { Link, useNavigate } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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
    setLoading(true);
    setIsLoggedOut(true);
    await logout();
    setUser(null);
    setLoading(false);
    toast.success("Logged out successfully");
    navigate("/");
  };

  return (
    <nav className="flex min-h-[7vh] max-h-[7vh] justify-between items-center px-6 py-4 border-b bg-background sticky top-0 z-50">
      <Link to="/" className="font-semibold text-lg text-foreground">
        🎓 Student Event Planner
      </Link>
      <div>
        {user ? (
          <div className="flex items-center gap-x-4">
             <Link className="flex items-center gap-x-1 text-sm text-foreground" to="/profile">
              <Avatar className="h-6 w-6">
                <AvatarImage
                  src={user.picture}
                  alt={user.name}
                  referrerPolicy="no-referrer"
                />
                <AvatarFallback>{user.name}</AvatarFallback>
              </Avatar>&nbsp;
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
