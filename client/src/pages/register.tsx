import { registerAccount, loginWithGoogle } from "@/lib/api";
import { useState } from "react";
import { toast } from "sonner";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { FcGoogle } from "react-icons/fc";

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== confirm) {
      toast.error("Passwords do not match");
      return;
    }

    setLoading(true);
    try {
      const res = await registerAccount(name, email, password);
      if (!res.success) throw new Error(res.error || "Registration failed");

      toast.success("Account created successfully! You can now log in.");
      window.location.href = "/login";
    } catch (err: any) {
      toast.error(err.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-background text-foreground">
      <Card className="w-88 shadow-md border border-border bg-card">
        <CardHeader>
          <CardTitle className="text-center text-xl font-semibold">
            🎓 Create Account
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-4">
          <form onSubmit={handleRegister} className="space-y-3">
            <div className="flex flex-col space-y-1">
              <label htmlFor="name" className="text-sm text-muted-foreground">
                Name
              </label>
              <Input
                id="name"
                type="text"
                placeholder="Your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>

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

            <div className="flex flex-col space-y-1">
              <label
                htmlFor="confirm"
                className="text-sm text-muted-foreground"
              >
                Confirm Password
              </label>
              <Input
                id="confirm"
                type="password"
                placeholder="••••••••"
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                required
              />
            </div>

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Creating account..." : "Register"}
            </Button>
          </form>

          <Separator className="my-4" />

          <Button
            variant="outline"
            className="w-full flex items-center justify-center gap-2 hover:bg-accent"
            onClick={loginWithGoogle}
          >
            <FcGoogle className="w-5 h-5" />
            Sign up with Google
          </Button>
        </CardContent>

        <CardFooter className="flex justify-center">
          <p className="text-xs text-muted-foreground">
            Already have an account?{" "}
            <a
              href="/login"
              className="underline text-primary hover:text-primary/80"
            >
              Login here
            </a>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
