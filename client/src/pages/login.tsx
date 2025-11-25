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
<div
className="min-h-screen w-full flex items-center justify-center relative  bg-gradient-to-b from-slate-900 via-slate-900 to-slate-800"
style={{
  backgroundImage: `url('/background-login.jpg')`, 
}}
>
    {/* Layer มืด + เบลอ */}
    <div className="absolute inset-0  bg-gradient-to-b from-slate-900 via-slate-900 to-slate-800"></div>

    {/* Title ด้านบน */}
  <h1
    className="
      absolute top-[10vh] text-4xl md:text-5xl font-bold 
      bg-gradient-to-r from-emerald-300 to-cyan-300 
      bg-clip-text text-transparent 
      drop-shadow-lg
    "
  >    Student Event Planner
  </h1>

  {/* Card Login */}
  <Card className="relative w-96 shadow-lg border border-border bg-white/90 backdrop-blur-md rounded-2xl">
    <CardHeader>
      <CardTitle className="text-center text-xl font-semibold text-black">
        Welcome!!
      </CardTitle>
    </CardHeader>

    <CardContent className="space-y-4">
      <form onSubmit={handleLocalLogin} className="space-y-3">
        <div className="flex flex-col space-y-1">
          <label htmlFor="email" className="text-sm text-black">
            Email
          </label>
          <Input
            id="email"
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="text-black"
          />
        </div>

        <div className="flex flex-col space-y-1">
          <label htmlFor="password" className="text-sm text-black">
            Password
          </label>
          <Input
            id="password"
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="text-black"
          />
        </div>

        <Button type="submit" className="w-full text-black" disabled={loading}>
          {loading ? "Signing in..." : "Login"}
        </Button>
      </form>

      <Separator className="my-4" />

      <Button
        variant="outline"
        className="w-full flex items-center justify-center gap-2 hover:bg-accent text-black"
        onClick={loginWithGoogle}
      >
        <FcGoogle className="w-5 h-5" />
        Sign in with Google
      </Button>


      {/* Terms */}
      <p className="text-center text-[11px] text-muted-foreground mt-2">
        By continuing, you agree to our Terms of Service and Privacy Policy.
      </p>
    </CardContent>

    <CardFooter className="flex justify-center">
      <p className="text-xs text-muted-foreground">
        Don't have an account?{" "}
        <a
          href="/register"
          className="underline text-black hover:text-black/70"
        >
          Register here
        </a>
      </p>
    </CardFooter>
  </Card>
</div>

  );
}