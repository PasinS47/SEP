import { loginWithEmail, loginWithGoogle } from "@/lib/api.ts";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { FcGoogle } from "react-icons/fc";
import { useState } from "react";
import { toast } from "sonner";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLocalLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await loginWithEmail(email, password);
      if (!res.success) throw new Error(res.error || "Login failed");

      toast.success("Logged in successfully");
      window.location.href = "/auth/callback";
    } catch (err: any) {
      toast.error(err.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background text-foregroundr">
      <Card className="w-88 shadow-mg border border-border bg-card">
        <CardHeader>
          <CardTitle className="text-center text-xl font-semibold">
            🎓 Student Event Planner
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-4">
          <form onSubmit={handleLocalLogin} className="space-y-3">
            <div className="flex flex-col space-y-1">
              <label htmlFor="email" className="text-sm text-muted-foreground">
                Email
              </label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="flex flex-col space-y-1">
              <label
                htmlFor="password"
                className="text-sm text-muted-foreground"
              >
                Password
              </label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Signing in..." : "Login"}
            </Button>
          </form>

          <Separator className="my - 4" />

          <Button
            variant="outline"
            className="w-full flex items-center justify-center gap-2 hover:bg-accent"
            onClick={loginWithGoogle}
          >
            <FcGoogle className="w-5 h-5" />
            Sign in with Google
          </Button>
        </CardContent>

        <CardFooter className="flex justify-center">
          <p className="text-xs text-muted-foreground">
            Don't have an account?{" "}
            <a
              href="/register"
              className="underline text-primary hover:text-primary/80"
            >
              Register here
            </a>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
