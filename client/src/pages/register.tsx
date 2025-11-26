import { registerAccount, loginWithGoogle } from "@/lib/api";
import { useState, useEffect } from "react";
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
import { useNavigate } from "react-router-dom";

export default function Register({ user }: { user: any; }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

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
      setTimeout(() => navigate("/login"), 100);
    } catch (err: any) {
      toast.error(err.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
      if (user) {
          toast.error("Already signed in!!");
          navigate("/profile");
          return;
      }

  }, [user, navigate]);

  return (
<div
  className="
    min-h-[93vh] w-full flex items-center justify-center pt-15 relative 
    bg-gradient-to-b from-slate-900 via-slate-900 to-slate-800
  "
>
  {/* Title เหมือนหน้า Login */}
  <h1
  className="
    absolute top-[10vh] text-4xl md:text-5xl font-bold 
    bg-gradient-to-r from-emerald-300 to-cyan-300 
    bg-clip-text text-transparent 
    drop-shadow-lg
  ">
    Student Event Planner
  </h1>

  {/* Register Card */}
  <Card className="relative w-96 shadow-lg border border-border bg-white/90 backdrop-blur-md rounded-2xl">
    <CardHeader>
      <CardTitle className="text-center text-xl font-semibold text-black">
        Create Account
      </CardTitle>
    </CardHeader>

    <CardContent className="space-y-4">
      <form onSubmit={handleRegister} className="space-y-3">
        
        {/* Name */}
        <div className="flex flex-col space-y-1">
          <label htmlFor="name" className="text-sm text-black">
            Name
          </label>
          <Input
            id="name"
            type="text"
            placeholder="Your name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="text-black"
          />
        </div>

        {/* Email */}
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

        {/* Password */}
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

        {/* Confirm Password */}
        <div className="flex flex-col space-y-1">
          <label htmlFor="confirm" className="text-sm text-black">
            Confirm Password
          </label>
          <Input
            id="confirm"
            type="password"
            placeholder="••••••••"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            required
            className="text-black"
          />
        </div>

        {/* Register Button */}
        <Button type="submit" className="w-full text-black" disabled={loading}>
          {loading ? "Creating account..." : "Register"}
        </Button>
      </form>

      <Separator className="my-4" />

      {/* Google Register */}
      <Button
        variant="outline"
        className="w-full flex items-center justify-center gap-2 hover:bg-accent text-black"
        onClick={loginWithGoogle}
      >
        <FcGoogle className="w-5 h-5" />
        Sign up with Google
      </Button>

     
    </CardContent>

    <CardFooter className="flex justify-center">
      <p className="text-xs text-black/70">
        Already have an account?{" "}
        <a
          href="/login"
          className="underline text-black hover:text-black/70"
        >
          Login here
        </a>
      </p>
    </CardFooter>
  </Card>
</div>

  );
}