import { loginWithGoogle } from "@/lib/api.ts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { FcGoogle } from "react-icons/fc";

export default function Login() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background text-foregroundr">
      <Card className="w-[22rem] shadow-lg border border-border bg-card">
        <CardHeader>
          <CardTitle className="text-center text-xl font-semibold">
          🎓 Student Event Planner
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col items-center space-y-6">
          <p className="text-sm text-muted-foreground text-center">
            Sign in to access events, create schedules, and manage your student activities.
          </p>
          <Separator />
          <Button 
            variant="outline" 
            className="w-full flex items-center justify-center gap-2 hover:bg-accent"
            onClick={loginWithGoogle}
          >
            <FcGoogle className="w-5 h-5 text-transparent flex-shrink-0"/>
            Sign in with Google
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
