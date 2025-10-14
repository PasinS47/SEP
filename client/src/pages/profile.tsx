import { fetchProfile, logout } from "@/lib/api.ts";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card.tsx";
import { Separator } from "@radix-ui/react-separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

export default function Profile({user, setUser}: { user: any; setUser: (u: any) => void; }) {
  const [profile, setProfile] = useState<any>(null);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!user) {
      toast.error("Please sign in first");
      navigate("/login");
      return;
    }
    (async () => {
      const res = await fetchProfile();
      if (res?.success) setProfile(res.user);
      else navigate("/login");
    })();
  }, [user, navigate])

  const handleLogout = async () => {
    setLoading(true);
    await logout();
    setUser(null);
    setLoading(false);
    toast.success("Logged out successfully");
    navigate("/");
  };

  if (!profile) return <p className="text-center mt-10">Loading profile...</p>;

  return (
    <div className="flex justify-center items-center min-h-[85vh] bg-background text-foreground">
      <Card className="w-[26rem] shadow-md border border-border bg-card">
        <CardHeader className="flex flex-col items-center space-y-2">
          <Avatar className="w-20 h-20">
            <AvatarImage src={user.picture} alt={user.name} />
            <AvatarFallback>{user.name[0]}</AvatarFallback>
          </Avatar>
          <CardTitle className="text-xl font-semibold mt-2">
            {user.name}
          </CardTitle>
          <p className="text-sm text-muted-foreground">{user.email}</p>
        </CardHeader>

        <CardContent>
          <Separator className="my-4" />
          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">User ID:</span>
              <span>{user.id}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Member since:</span>
              <span>
                {new Date(user.createdAt).toLocaleDateString(undefined, {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                })}
              </span>
            </div>
          </div>

          <Separator className="my-4" />

          <div className="flex justify-center">
            <Button
              variant="destructive"
              onClick={handleLogout}
              disabled={loading}
              className="w-full"
            >
              {loading ? "Logging out..." : "Logout"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
