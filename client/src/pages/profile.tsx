import { fetchProfile, logout } from "@/lib/api.ts";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card.tsx";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

export default function Profile({
  user,
  setUser,
  isLoggedOut,
  setIsLoggedOut,
}: {
  user: any;
  setUser: (u: any) => void;
  isLoggedOut: any;
  setIsLoggedOut: (u: any) => void;
}) {
  const [profile, setProfile] = useState<any>(null);
  const [stats, setStats] = useState<any>(null);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!user && !isLoggedOut) {
      toast.error("Please sign in first");
      navigate("/login");
      return;
    }
    (async () => {
      const res = await fetchProfile();
      if (res?.success) {
          setProfile(res.user);
          setStats(res.stats);
      }
      else navigate("/login");
    })();
  }, [user, navigate]);

  const handleLogout = async () => {
    setIsLoggedOut(true);
    setLoading(true);
    await logout();
    setUser(null);
    setLoading(false);
    toast.success("Logged out successfully");
    navigate("/");
  };

  if (!user || !profile) {
    return (
      <div className="flex justify-center items-center min-h-[80vh] text-muted-foreground">
        Loading profile...
      </div>
    );
  }

  return (
    <div className="flex justify-center items-center min-h-[93vh] text-foreground">
      <Card className="w-104 shadow-md border border-border bg-card">
        <CardHeader className="flex flex-col items-center space-y-2">
          <Avatar className="w-24 h-24">
            <AvatarImage
              src={user.picture}
              alt={user.name}
              referrerPolicy={"no-referrer"}
            />
            <AvatarFallback>{user.name[0]}</AvatarFallback>
          </Avatar>
          <CardTitle className="text-2xl font-semibold mt-2">
            {user.name}
          </CardTitle>
          <p className="text-sm text-muted-foreground">{user.email}</p>
        </CardHeader>

        <CardContent>
          <Separator className="my-4" />
          <div className="space-y-4 text-sm">
            <div className="grid gap-3">
                <h3 className="font-semibold text-base">Account Details</h3>
                <div className="flex justify-between">
                <span className="text-muted-foreground">User ID:</span>
                <span className="font-mono text-xs">{user.id}</span>
                </div>
                <div className="flex justify-between">
                <span className="text-muted-foreground">Member since:</span>
                <span>
                    {new Date(user.createdAt).toLocaleDateString(undefined, {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                    })}
                </span>
                </div>
            </div>

            <Separator className="my-2" />
            
            <div className="grid gap-3">
                <h3 className="font-semibold text-base">Statistics</h3>
                <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Total Events Created:</span>
                    <span className="bg-primary/10 text-primary px-2 py-1 rounded-md font-bold">
                        {stats?.eventsCreated || 0}
                    </span>
                </div>
            </div>
          </div>

          <Separator className="my-6" />

          <div className="flex justify-center gap-3">
             {/* [UPDATED BUTTON] Replaced Logout with Go to Calendar */}
            <Button
              className="w-full"
              onClick={() => navigate("/calendar")}
            >
              Go to Calendar
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}