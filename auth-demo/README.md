# 🔒 Auth Security Demo: Insecure Headers vs JWT Authentication

An educational full-stack demo project that demonstrates **why trusting client-controlled headers is dangerous** and **how JWT-based authentication fixes the issue**.

## The Vulnerability

Many developers new to web security make the mistake of trusting client-provided headers for authentication. This project shows why that's dangerous.

### ❌ The Insecure Pattern

```javascript
// ❌ NEVER do this!
const userId = req.headers["x-viewer-user-id"];
const data = database.find(userId); // ← Trusts the client!
```

**What happens:** The server asks "Who are you?" and the client responds "I'm admin." The server says "OK!" and returns admin's data. No verification whatsoever.

### ✅ The Secure Pattern

```javascript
// ✅ Always do this!
const token = req.cookies["db_liquid_session"]; // HttpOnly cookie
const decoded = jwt.verify(token, SECRET);       // Verify signature
const userId = decoded.userId;                   // From verified token
// req.headers["x-viewer-user-id"] is IGNORED
const data = database.find(userId);
```

**What happens:** The server reads a **cryptographically signed JWT** from an **HttpOnly cookie**, verifies the signature, and extracts the user identity. Any fake headers sent by the client are **ignored**.

## How HttpOnly Cookies Work

| Feature | Regular Cookie | HttpOnly Cookie |
|---------|---------------|-----------------|
| Readable by JavaScript | ✅ Yes | ❌ No |
| Sent with HTTP requests | ✅ Yes | ✅ Yes |
| Vulnerable to XSS theft | ✅ Yes | ❌ No |
| Can set via `document.cookie` | ✅ Yes | ❌ No |

HttpOnly cookies **cannot be read or modified by JavaScript**. This means even if an attacker finds an XSS vulnerability, they **cannot steal the JWT token**.

## Demo Credentials

| Username | Password | User ID | Name |
|----------|----------|---------|------|
| `alice` | `password123` | `user1` | Alice Johnson |
| `bob` | `password456` | `user2` | Bob Smith |
| `admin` | `admin123` | `admin` | Admin User |

## Project Structure

```
auth-demo/
├── backend/
│   ├── server.js                 # Express server entry point
│   ├── package.json
│   ├── middleware/
│   │   ├── authenticate.js       # JWT verification middleware
│   │   └── logger.js             # Request logging middleware
│   ├── routes/
│   │   ├── auth.js               # Login/logout routes
│   │   ├── insecure.js           # INSECURE routes (use header)
│   │   └── secure.js             # SECURE routes (use JWT)
│   ├── controllers/
│   │   ├── authController.js     # Login/logout logic
│   │   ├── insecureController.js # INSECURE: trusts header
│   │   └── secureController.js   # SECURE: ignores header
│   └── models/
│       └── data.js               # In-memory data store
├── frontend/
│   ├── src/
│   │   ├── App.jsx               # Main app with routing
│   │   ├── api/axios.js          # Axios config with credentials
│   │   ├── pages/
│   │   │   ├── InsecureDemo.jsx  # ❌ Insecure demo tab
│   │   │   ├── SecureDemo.jsx    # ✅ Secure demo tab
│   │   │   └── AttackSimulator.jsx # 🛡️ Attack simulator
│   │   └── index.css             # Tailwind styles
│   ├── index.html
│   ├── vite.config.js            # Vite config with proxy
│   └── package.json
└── README.md
```

## How to Run

### Prerequisites

- Node.js 18+
- npm

### 1. Start the Backend

```bash
cd auth-demo/backend
npm install
node server.js
```

The server starts at **http://localhost:4000**

### 2. Start the Frontend (in a new terminal)

```bash
cd auth-demo/frontend
npm install
npm run dev
```

The frontend starts at **http://localhost:5173**

### 3. Open the App

Navigate to **http://localhost:5173** in your browser.

## Step-by-Step: Reproduce the Vulnerability

### Insecure Demo (Tab 1)

1. Go to the **❌ Insecure Demo** tab
2. Select "Alice (user1)" from the dropdown
3. Click **"Fetch Listings"** — you see Alice's listings with phone, email, and private notes
4. Change the dropdown to **"Bob (user2)"**
5. Click **"Fetch Listings"** again — now you see Bob's private data!
6. Change to **"Admin (admin)"** — you see the admin's data
7. **🎯 Vulnerability confirmed:** You impersonated 3 different users just by changing a header

### What happened?

The server blindly trusts `X-Viewer-User-Id`. No login, no password, no verification. Just a header that anyone can set.

### In production, this would let attackers:

- View other users' private messages
- Access admin panels
- Steal personal information (phone, email, address)
- Modify other users' data
- Delete resources they don't own

## Step-by-Step: Verify the Fix

### Secure Demo (Tab 2)

1. Go to the **✅ Secure Demo** tab
2. Select a user and enter their password, click **Login**
3. The server creates a **JWT** and stores it in an **HttpOnly cookie**
4. Click **"Fetch My Listings"** — you see only YOUR listings
5. **Enable Dev Mode** — this lets you send fake `X-Viewer-User-Id` headers
6. Type `admin` in the fake header field
7. Click **"Fetch My Listings"** again
8. **🎯 Security confirmed:** You still see YOUR data, NOT admin's data!

### Why does this work?

1. The server reads the **JWT from the HttpOnly cookie**
2. The **authenticate() middleware** verifies the JWT signature
3. The userId is extracted from the **verified token**
4. The `X-Viewer-User-Id` header is **completely ignored**
5. The server only returns data for `req.auth.userId`

## Attack Simulator (Tab 3)

The Attack Simulator shows both APIs side-by-side:

- Send the **same fake header** to both the insecure and secure APIs
- See the **insecure API return unauthorized data** 🚨
- See the **secure API ignore the fake header** 🛡️
- Compare results in a **summary table**

## API Endpoints

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/insecure/listings` | ❌ Header | Trusts X-Viewer-User-Id |
| POST | `/api/auth/login` | None | Login, sets JWT cookie |
| POST | `/api/auth/logout` | None | Clears JWT cookie |
| GET | `/api/auth/me` | ✅ JWT | Current user info |
| GET | `/api/secure/listings` | ✅ JWT | User's listings |
| GET | `/api/users` | None | List demo users |
| GET | `/api/health` | None | Server health |

## Key Security Concepts Demonstrated

### ❌ What NOT to do

- ❌ Trust `X-Viewer-User-Id` or any client-provided header
- ❌ Store JWTs in `localStorage` or `sessionStorage`
- ❌ Return sensitive data without verifying the requester's identity

### ✅ What TO do

- ✅ Verify user identity on **every request**
- ✅ Use **HttpOnly cookies** for token storage
- ✅ Use **JWT with signature verification**
- ✅ **Ignore** client-provided identity headers
- ✅ Apply **principle of least privilege**

## Educational Notes

### What the attacker sees

```
Request:
  GET /api/insecure/listings
  X-Viewer-User-Id: admin

Response:
  { "phone": "0000000000", "email": "admin@example.com", ... }
```

### What the server trusts (secure)

```
Request:
  GET /api/secure/listings
  X-Viewer-User-Id: admin            ← Client sends this
  Cookie: db_liquid_session=eyJ...   ← JWT from HttpOnly cookie

Server processing:
  1. authenticate() middleware reads cookie
  2. jwt.verify(token, SECRET) → { userId: "user1" }
  3. req.auth.userId = "user1"       ← From JWT
  4. X-Viewer-User-Id: admin         ← IGNORED
  5. Return data for userId: user1   ← Correct owner
```

## License

This project is for **educational purposes only**. The insecure patterns shown are intended to teach developers what to avoid in production.
