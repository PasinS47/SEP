# 🎓 Student Event Planner

A full-stack web application built with **React + Vite + TypeScript (client)** and **ElysiaJS + Bun (server)**.  
Users can sign in with Google OAuth2, view their profile, and log out securely using JWT-based authentication.

---

## 🧱 Tech Stack

| Layer      | Technology                                      |
|------------|-------------------------------------------------|
| Frontend   | React 18, Vite, TypeScript, TailwindCSS         |
| Backend    | ElysiaJS, elysia-oauth2, JWT, Cookie-based auth |
| Auth       | Google OAuth 2.0                                |
| Database   | (temporary) in-memory `Map`                     |

---

## 🚀 Getting Started

### 1️⃣ Clone the repository
```bash
git clone https://github.com/PasinS47/SEP.git
cd SEP
git checkout feature/google-auth-fullstack
```

---

### 2️⃣ Install dependencies
```bash
bun install
```

---

### ⚙️ Environment Variables 
**Backend** (`server/.env`)
```.dotenv
GOOGLE_OAUTH_CLIENT_ID=your_google_client_id
GOOGLE_OAUTH_CLIENT_SECRET=your_google_client_secret
GOOGLE_OAUTH_REDIRECT_URI=http://localhost:3000/auth/google/callback
FRONTEND_URL=http://localhost:5173
JWT_SECRET=super_secret_key_12345
```
**Frontend** (`client/.env`)
```dotenv
VITE_API_URL=http://localhost:3000
```

---

### ▶️ Running the project
**Start backend**
```bash
cd server
bun run dev
# or
bun run dev:server # ⚠ see note below about Ctrl +C
```
**Start frontend**
```bash
cd client
bun run dev
# or
bun run dev:client # ⚠ see note below about Ctrl +C
```
**Start both**
```bash
bun run dev # ⚠ see note below about Ctrl +C
```
Then open: http://localhost:5173

---

### 🔐 Auth Flow Overview
1. User clicks “Sign in with Google”
2. Redirects to Google OAuth consent screen
3. On success → backend stores user info in memory and issues JWT in a cookie
4. React frontend detects login via cookie → fetches /api/auth/me or /api/profile
5. Users can view profile and logout safely

---

### 📁 Project Structure
```
student-event-planner/
├─ client/
│  ├─ src/
│  │  ├─ pages/          # Home, Login, Profile, Callback
│  │  ├─ hooks/          # useUser.ts
│  │  ├─ components/     # Navbar
│  │  └─ App.tsx, main.tsx
│  └─ .env
├─ backend/
│  ├─ src/
│  │  └─ index.ts        # main Elysia server
│  └─ .env
└─ README.md
```

---

### 🧪 Testing login
- Visit: http://localhost:5173/login
- Click Sign in with Google → Google consent page
- After redirect, backend sets cookie auth
- You’ll be redirected to /profile showing your name, email, and avatar

---

### 🚪 Logout flow
Click the Logout button on the profile page.<br>
This triggers `POST /api/auth/logout`, removes the cookie, and resets UI immediately.

---

### ⚠ Known Issues
🐞 `Bun --filter + Ctrl +C`

When running `bun --filter <target> run dev` or `bun run dev:<taget>` at root<br>
Bun sometimes does **not terminate the process** properly after Ctrl +C`.

Workaround:
- Run `kill` manually
- Or run without `--filter`:
    ```bash
    cd <target> && bun run dev
    ```
- Or use an external process manager.