import { Elysia } from "elysia";
import { cors } from "@elysiajs/cors";
import { cookie } from "@elysiajs/cookie";
import { jwt } from "@elysiajs/jwt";
import { oauth2 } from "elysia-oauth2";
import { hash, compare } from "bcryptjs";

interface User {
  id: string;
  email: string;
  name: string;
  picture: string;
  createdAt: Date;
}

const users = new Map<string, User>();

const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:5173";
const JWT_SECRET = process.env.JWT_SECRET || "super_secret_key_12345";
const NODE_ENV = process.env.NODE_ENV || "development";
const SESSION_EXPIRATION_MS = 5 * 60 * 1000;
const SESSION_SPAN_MS = 24 * 60 * 60 * 1000;

const app = new Elysia()
  .use(
    cors({
      origin: FRONTEND_URL,
      credentials: true,
      methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
      allowedHeaders: ["Content-Type", "Authorization"],
      exposeHeaders: ["Set-Cookie", "X-Token-Warning", "X-Token-Remaining"],
    })
  )
  .use(cookie())
  .use(
    jwt({
      name: "jwt",
      secret: JWT_SECRET,
    })
  )
  .use(
    oauth2({
      Google: [
        process.env.GOOGLE_OAUTH_CLIENT_ID!,
        process.env.GOOGLE_OAUTH_CLIENT_SECRET!,
        process.env.GOOGLE_OAUTH_REDIRECT_URI!,
      ],
    })
  )
  .onBeforeHandle(async ({ set, jwt, cookie}) => {
    if(cookie.auth){
      try {
        const decoded = await jwt.verify(cookie.auth.value);
        
        if(!decoded.expires || decoded.expires === "0"){
          return;
        }

        const expiration = new Date(JSON.parse(decoded.expires));
        const diff = expiration.getTime() - (new Date()).getTime();
        
        if(diff < SESSION_EXPIRATION_MS && decoded.expires !== "0"){

          console.log("There is ", Math.floor(diff / (1000)) , " seconds left until expiration.");
          set.headers['X-Token-Warning'] = 'Session expiring soon';
          set.headers['X-Token-Remaining'] = Math.floor(diff / 1000).toString();

          const updatedTime = await jwt.sign({
            id: decoded.id,
            email: decoded.email,
            name: decoded.name,
            expires: "0",
          });

          cookie.auth.set({
            value: updatedTime,
            httpOnly: true,
            secure: NODE_ENV === "production",
            sameSite: NODE_ENV === "production" ? "none" : "lax",
            domain: NODE_ENV === "production" ? undefined : "localhost",
            path: "/",
            maxAge: Math.floor(diff / 1000),
          });
        }
      } catch (error) {
        console.log("❌ Invalid token:", error);
      }
    }
  })
  .get("/", () => ({
    message: "🎓 Student Event Planner API",
    status: "running",
    endpoint: {
      auth: "/auth/google",
      profile: "/api/profile",
      me: "/api/auth/me",
    },
  }))
  .get("/auth/google", ({ oauth2, redirect }) => {
    const url = oauth2.createURL("Google", ["openid", "email", "profile"]);
    url.searchParams.set("access_type", "offline");
    url.searchParams.set("prompt", "select_account consent");

    return redirect(url.href);
  })
  .get(
    "/auth/google/callback",
    async ({ oauth2, query, jwt, cookie, redirect }) => {
      try {
        const { code } = query;

        if (!code) {
          redirect(`${FRONTEND_URL}/login?error=no_code`);
          return "No authorization code provided";
        }

        const token = await oauth2.authorize("Google");
        const accessToken = token.accessToken();
        const response = await fetch(
          "https://openidconnect.googleapis.com/v1/userinfo",
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );
        if (!response.ok) {
          console.error("❌ Google API error:", await response.text());
          return redirect(`${FRONTEND_URL}/login?error=google_api_failed`);
        }

        const googleUser = await response.json();
        const userId = googleUser.sub || googleUser.id;
        let user = users.get(userId);
        if (!user) {
          user = {
            id: userId,
            email: googleUser.email,
            name: googleUser.name,
            picture: googleUser.picture,
            createdAt: new Date(),
          };
          users.set(userId, user);
          console.log(
            `✅ New user registered: ${googleUser.name} (${googleUser.email})`
          );
        } else {
          user.name = googleUser.name;
          user.picture =
            googleUser.picture ||
            `https://ui-avatars.com/api/?name=${encodeURIComponent(
              googleUser.name
            )}`;
          users.set(googleUser.id, user);
          console.log(`✅ User logged in: ${user.email}`);
        }

        const authToken = await jwt.sign({
          id: user.id,
          email: user.email,
          name: user.name,
          expires: JSON.stringify(new Date(Date.now() + (SESSION_EXPIRATION_MS))),
        });

        cookie.auth.set({
          value: authToken,
          httpOnly: true,
          secure: NODE_ENV === "production",
          sameSite: NODE_ENV === "production" ? "none" : "lax",
          domain: NODE_ENV === "production" ? undefined : "localhost",
          path: "/",
          maxAge: SESSION_SPAN_MS / 1000,
        });

        return redirect(`${FRONTEND_URL}/auth/callback`);
      } catch (error) {
        console.error("❌ OAuth error:", error);
        return redirect(`${FRONTEND_URL}/login?error=auth_failed`);
      }
    }
  )
  .get("/api/auth/me", async ({ jwt, cookie, set }) => {
    const token = cookie.auth.value;
    if (!token) {
      set.status = 401;
      return {
        success: false,
        error: "Not authenticated",
      };
    }
    try {
      const payload = await jwt.verify(token);
      if (!payload || typeof payload !== "object" || !("id" in payload)) {
        set.status = 401;
        return {
          success: false,
          error: "Invalid token",
        };
      }

      const user = users.get(payload.id as string);
      if (!user) {
        set.status = 404;
        return {
          success: false,
          error: "User not found",
        };
      }

      // const newToken = await jwt.sign({
      //   id: user.id,
      //   email: user.email,
      //   name: user.name,
      //   expires: JSON.stringify(new Date(Date.now() + (60 * 1000))),
      // });

      // cookie.auth.set({
      //   value: newToken,
      //   httpOnly: true,
      //   secure: NODE_ENV === "production",
      //   sameSite: NODE_ENV === "production" ? "none" : "lax",
      //   domain: NODE_ENV === "production" ? undefined : "localhost",
      //   path: "/",
      //   maxAge: SESSION_SPAN_MS / 1000,
      // });

      return {
        success: true,
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          picture: user.picture,
          createdAt: user.createdAt.toISOString(),
        },
      };
    } catch (error) {
      set.status = 401;
      return {
        success: false,
        error: "Invalid token",
      };
    }
  })
  .post("/api/auth/logout", async ({ cookie, set }) => {
    cookie.auth.remove();
    set.status = 200;
    return {
      success: true,
      message: "Logged out successfully",
    };
  })
  .get("/api/profile", async ({ jwt, cookie, set }) => {
    const token = cookie.auth.value;
    if (!token) {
      set.status = 401;
      return { error: "Unauthorized" };
    }
    try {
      const payload = await jwt.verify(token);
      if (!payload || typeof payload !== "object" || !("id" in payload)) {
        set.status = 401;
        return { error: "Invalid token" };
      }

      const user = users.get(payload.id as string);
      if (!user) {
        set.status = 404;
        return { error: "User not found" };
      }

      set.status = 200;
      return {
        success: true,
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          picture: user.picture,
          memberSince: user.createdAt.toISOString(),
        },
        stats: {
          eventsCreated: 0,
          eventsJoined: 0,
          totalAttendees: 0,
        },
      };
    } catch (error) {
      set.status = 401;
      return { error: "Unauthorized" };
    }
  })
  .post("/api/auth/register", async ({ body, set }) => {
    const { email, password, name } = body as {
        email?: string;
        password?: string;
        name?: string;
    };

    if (!email || !password || !name) {
        set.status = 400;
        return { success: false, error: "Missing fields" };
    }

    // check if already exist
    for (const u of users.values()) {
        if (u.email === email) {
            set.status = 409;
            return { success: false, error: "Email already registered" };
        }
    }

    const id = crypto.randomUUID();
    const hashed = await hash(password, 10);
    const user: User = {
        id,
        email,
        name,
        picture: `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}`,
        createdAt: new Date(),
    };

    // store password in separated map
    (user as any).password = hashed;
    users.set(id, user);

    set.status = 201;
    return { success: true, message: "User registered" };
  })
  .post("/api/auth/login", async ({ body, set, jwt, cookie }) => {
    const { email, password } = body as { email?: string; password?: string };
    if (!email || !password) {
        set.status = 400;
        return { success: false, error: "Missing fields" };
    }

    const user = Array.from(users.values()).find((u) => u.email === email);
    if (!user || !(user as any).password) {
        set.status = 401;
        return { success: false, error: "Invalid email or password" };
    }

    const match = await compare(password, (user as any).password);
    if (!match) {
        set.status = 401;
        return { success: false, error: "Invalid email or password" };
    }

    const token = await jwt.sign({
        id: user.id,
        email: user.email,
        name: user.name,
        expires: JSON.stringify(new Date(Date.now() + (SESSION_SPAN_MS))),
    });

    cookie.auth.set({
        value: token,
        httpOnly: true,
        secure: NODE_ENV === "production",
        sameSite: NODE_ENV === "production" ? "none" : "lax",
        path: "/",
        maxAge: SESSION_SPAN_MS / 1000,
    });

    return {
        success: true,
        user: {
            id: user.id,
            email: user.email,
            name: user.name,
            picture: user.picture,
        },
    };
  })
  .listen(3000);

console.log(`
╔═══════════════════════════════════════════════════════╗
║  🦊 Elysia Server is running!                        ║
║  📍 http://${app.server?.hostname}:${app.server?.port}                         ║
║                                                       ║
║  🔐 Google OAuth is configured                       ║
║  🎓 Student Event Planner API                        ║
╚═══════════════════════════════════════════════════════╝
`);

console.log("📝 Available routes:");
console.log("   GET  / - API Info");
console.log("   GET  /auth/google - Start OAuth");
console.log("   GET  /auth/google/callback - OAuth Callback");
console.log("   GET  /api/auth/me - Get current user");
console.log("   POST /api/auth/logout - Logout");
console.log("   GET  /api/profile - Get user profile (Protected)");
console.log("");
