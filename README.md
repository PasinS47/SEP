# 🎓 Student Event Planner

A full-stack web application for scheduling and event management. The system uses **React (Vite)** for the frontend and **ElysiaJS (Bun)** for the backend, with **MySQL** as the database for events.

---

## 1. 📝 Prerequisites

Ensure you have the following software installed on your machine:

* **Bun** (v1.0.0 or later) - Used as the runtime and package manager.
* **MySQL Server** (v8.0 or later) - Used to store event data.
* **Node.js** (Optional, but recommended for some development tools).

---

## 2. 📦 Installation

Clone the repository and install the dependencies for both the client and server using Bun's workspace feature.

```bash
# 1. Clone the repository
git clone [https://github.com/PasinS47/SEP.git](https://github.com/PasinS47/SEP.git)
cd SEP

# 2. Install dependencies (installs for root, server, and client)
bun install
```
## 3. ⚙️ Configuration

You need to configure the database connection manually and set up environment variables for both the client and server.

### A. Database Connection (Required)
⚠️ **Note:** The database connection settings are currently **hardcoded** in the source file. You must update them to match your local MySQL configuration.

1.  Open the file `server/src/sql.ts`.
2.  Modify the `connection` object with your MySQL credentials:
    ```typescript
    // server/src/sql.ts
    const connection = await mysql.createConnection({
        host: "localhost",
        user: "root",             // <--- Change to your MySQL username
        password: "qwerty",       // <--- Change to your MySQL password
        database: "student_planner",
        port: 3306,
    });
    ```

### B. Environment Variables
Create the following `.env` files in their respective directories.

**1. Server** (`server/.env`)
```env
FRONTEND_URL=http://localhost:5173
JWT_SECRET=super_secret_key_12345

# Google OAuth (Optional if using Local Login)
GOOGLE_OAUTH_CLIENT_ID=your_google_id
GOOGLE_OAUTH_CLIENT_SECRET=your_google_secret
GOOGLE_OAUTH_REDIRECT_URI=http://localhost:3000/auth/google/callback
```
**2. Client** (`client/.env`)
```env
VITE_API_URL=http://localhost:3000
```
## 4. ▶️ How to Run

This project is configured to run both the client and server concurrently from the root directory.

```bash
# Run this from the root directory
bun run dev
```

* **Frontend:** http://localhost:5173
* **Backend:** http://localhost:3000

---

## 5. 🗄️ Import Database Data

The application requires a MySQL database to store event data. Since the provided SQL file only contains table definitions and data, you must create the database first.

1.  **Create the Database:**
    Log in to your MySQL server and create a database named `student_planner`.
    ```sql
    CREATE DATABASE student_planner;
    ```

2.  **Import Schema & Data:**
    Import the `database_schema_and_data.sql` file located in the root directory.
    * **Via Command Line:**
        ```bash
        mysql -u root -p student_planner < database_schema_and_data.sql
        ```
    * **Via GUI (Workbench, DBeaver, etc.):** Open `database_schema_and_data.sql` and execute the script against the `student_planner` database.

---

## 6. 🔐 Test Credentials

**⚠️ Important Architecture Note:**
* **User Accounts** are stored **in-memory (RAM)** on the server. Restarting the server **wipes all user accounts**.
* **Events** are stored in **MySQL** and persist across restarts.

Because user accounts are ephemeral, there are **no pre-existing users** to log in with immediately. You must register a new account to test the system.

**Testing Steps:**
1.  Navigate to http://localhost:5173/register.
2.  Create a test account (e.g., Email: `admin@test.com`, Password: `password`).
3.  You will be redirected to the Login page.
4.  Log in with your new credentials to access the Profile and Calendar.

---

## 7. 🚧 Project Status & Known Issues

* **In-Memory User Storage:** User profiles are stored in a JavaScript `Map` and will be lost when the server stops. You must register again after every restart.
* **Database Configuration:** Database credentials (`user`, `password`) are currently hardcoded in `server/src/sql.ts` and must be updated manually in the file.
* **Bun Process Cleanup:** When using `bun run dev`, stopping the process with `Ctrl + C` may sometimes leave child processes running in the background. If you encounter a "Port in use" error upon restarting, manually kill the lingering Node/Bun processes.
