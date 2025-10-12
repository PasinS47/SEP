import {Elysia} from "elysia";
import {cors} from "@elysiajs/cors"
import {cookie} from "@elysiajs/cookie"
import {jwt} from "@elysiajs/jwt"
import {oauth2} from "elysia-oauth2"

interface User {
    id: string;
    email: string;
    name: string;
    picture: string;
    createdAt: Date;
}

const users = new Map<string, User>()

const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:5173"
const JWT_SECRET = process.env.JWT_SECRET || "super_secret_key_12345"

const app = new Elysia()
    .use(
        cors({
            origin: FRONTEND_URL,
            credentials: true,
            methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
            allowedHeaders: ["Content-Type", "Authorization"],
        })
    )
    .use(cookie())
    .use(
        jwt({
            name: 'jwt',
            secret: JWT_SECRET
        })
    )
    .use(
        oauth2({
            Google: [
                process.env.GOOGLE_OAUTH_CLIENT_ID!,
                process.env.GOOGLE_OAUTH_CLIENT_SECRET!,
                process.env.GOOGLE_OAUTH_REDIRECT_URI!,
            ]
        })
    )
    .get("/", () => ({
        message: "🎓 Student Event Planner API",
        status: "running",
        endpoint: {
            auth: "/auth/google",
            profile: "/api/profile",
            me: "/api/auth/me"
        }
    }))
    .get("/auth/google", ({ oauth2, redirect }) => {
        const url = oauth2.createURL("Google", ["openid", "email", "profile"]);
        url.searchParams.set("access_type", "offline");
        url.searchParams.set("prompt", "consent");

        return redirect(url.href);
    })
    .get("/auth/google/callback", async ({oauth2, query, jwt, cookie, redirect}) => {
        try {
            const { code } = query

            if (!code) {
                redirect(`${FRONTEND_URL}/login?error=no_code`)
                return "No authorization code provided"
            }

            const token = await oauth2.authorize("Google");
            const accessToken = token.accessToken();
            const response = await fetch("https://www.googleapis.com/oauth2/v2/userinfo", {
                headers: {
                    Authorization: `Bearer ${accessToken}`
                }
            })
            if(!response.ok) {
                throw new Error("Failed to fetch user information")
            }

            const googleUser = await response.json()
            let user = users.get(googleUser.id)
            if (!user) {
                user = {
                    id: googleUser.id,
                    email: googleUser.email,
                    name: googleUser.name,
                    picture: googleUser.picture,
                    createdAt: new Date()
                }
                users.set(googleUser.id, user)
                console.log(`✅ New user registered: ${googleUser.name} (${googleUser.email})`)
            } else {
                user.name = googleUser.name
                user.picture = googleUser.picture
                users.set(googleUser.id, user)
                console.log(`✅ User logged in: ${user.email}`)
            }

            const authToken = await jwt.sign({
                id: user.id,
                email: user.email,
                name: user.name
            })

            cookie.auth.set({
                value: authToken,
                httpOnly: true,
                secure: false,
                sameSite: "lax",
                path: "/",
                maxAge: 7 * 24 * 60 * 60, // 7 days
            })

            return redirect(`${FRONTEND_URL}/auth/callback`)
        } catch (error) {
            console.error("❌ OAuth error:", error)
            return redirect(`${FRONTEND_URL}/login?error=auth_failed`)
        }
    })
    .get("/api/auth/me", async ({ jwt, cookie, set }) => {
        const token = cookie.auth.value
        if (!token) {
            set.status = 401
            return {
                success: false,
                error: "Not authenticated"
            }
        }
        try {
            const payload = await jwt.verify(token)
            if (!payload || typeof payload !== "object" || !("id" in payload)) {
                set.status = 401
                return {
                    success: false,
                    error: "Invalid token"
                }
            }

            const user = users.get(payload.id as string)
            if (!user) {
                set.status = 404
                return {
                    success: false,
                    error: "User not found"
                }
            }

            return {
                success: true,
                user: {
                    id: user.id,
                    email: user.email,
                    name: user.name,
                    picture: user.picture,
                    createdAt: user.createdAt.toISOString()
                }
            }
        } catch (error) {
            set.status = 401
            return {
                success: false,
                error: "Invalid token"
            }
        }
    })
    .post("/api/auth/logout", async ({ cookie, set }) => {
        cookie.auth.remove()
        set.status = 200
        return {
            success: true,
            message: "Logged out successfully"
        }
    })
    .get("/api/profile", async ({ jwt, cookie, set }) => {
        const token = cookie.auth.value
        if (!token) {
            set.status = 401
            return { error: "Unauthorized" }
        }
        try {
            const payload = await jwt.verify(token)
            if (!payload || typeof payload !== "object" || !("id" in payload)) {
                set.status = 401
                return { error: "Invalid token" }
            }

            const user = users.get(payload.id as string)
            if (!user) {
                set.status = 404
                return { error: "User not found" }
            }

            return {
                success: true,
                user: {
                    id: user.id,
                    email: user.email,
                    name: user.name,
                    picture: user.picture,
                    memberSince: user.createdAt.toISOString()
                },
                stats: {
                    eventsCreated: 0,
                    eventsJoined: 0,
                    totalAttendees: 0
                }
            }
        } catch (error) {
            set.status = 401
            return { error: "Unauthorized" }
        }
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
`)

console.log('📝 Available routes:')
console.log('   GET  / - API Info')
console.log('   GET  /auth/google - Start OAuth')
console.log('   GET  /auth/google/callback - OAuth Callback')
console.log('   GET  /api/auth/me - Get current user')
console.log('   POST /api/auth/logout - Logout')
console.log('   GET  /api/profile - Get user profile (Protected)')
console.log('')