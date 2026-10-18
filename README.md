# Rifat — Personal Data Science Portfolio & Learning Journey

A modern, production-grade personal portfolio and learning roadmap built for **Rifat**, a Computer Science & Engineering undergraduate student aspiring to become a Data Scientist.

---

## 1. Project Folder Structure

```
├── firebase-applet-config.json    # Firebase client credentials & Firestore database ID
├── firebase-blueprint.json        # Data architecture intermediate representation (IR)
├── firestore.rules                # Hardened Attribute-Based Access Control security rules
├── firestore.rules.test.ts        # Test runner for security threat validation
├── security_spec.md               # Security specification & threat model documentation
├── index.html                     # HTML5 entry with fonts, metadata, and OpenGraph tags
├── metadata.json                  # AI Studio project descriptors & permissions
├── package.json                   # Dependencies (React 19, Firebase SDK, Tailwind, Lucide)
├── tsconfig.json                  # TypeScript compiler settings (strict type checking)
├── vite.config.ts                 # Vite bundler configuration with Tailwind CSS v4
├── src/
│   ├── main.tsx                   # React root entry point
│   ├── App.tsx                    # Main orchestrator, routes, and modal controller
│   ├── index.css                  # Tailwind styles, dark theme, and grid utilities
│   ├── types/
│   │   └── index.ts               # Strict TypeScript definitions for all entities
│   ├── lib/
│   │   ├── firebase.ts            # Firebase app, Auth, Firestore instance & error handling
│   │   └── defaultData.ts         # Realistic baseline data for Rifat's portfolio
│   ├── services/
│   │   └── portfolioService.ts    # Centralized Firestore data access & CRUD layer
│   ├── context/
│   │   └── AuthContext.tsx        # Firebase Auth listener & admin role validation
│   └── components/
│       ├── Navbar.tsx             # Sticky navigation with mobile drawer & admin trigger
│       ├── Hero.tsx               # High-impact introduction, CTAs, and live code badge
│       ├── AboutSection.tsx       # Transparent academic narrative & learning principles
│       ├── SkillsSection.tsx      # Categorized technical capabilities & status badges
│       ├── LearningJourneySection.tsx # Chronological learning roadmap timeline
│       ├── ProjectsSection.tsx    # Project gallery with filtering and search
│       ├── ProjectDetailModal.tsx # In-depth study viewer (methodology, datasets, findings)
│       ├── CertificationsSection.tsx  # Documented coursework & credentials
│       ├── ContactSection.tsx     # Direct mailto, copy email button, and social profiles
│       ├── Footer.tsx             # Tech stack badges and copyright
│       ├── Toast.tsx              # Animated operation notifications
│       └── admin/
│           ├── AdminDashboard.tsx # Comprehensive admin control suite & metrics
│           ├── ProjectModal.tsx   # Project creation/editing form with live preview
│           ├── SkillModal.tsx     # Skill creation/editing form with category & status
│           ├── JourneyModal.tsx   # Roadmap milestone modal
│           ├── CertModal.tsx      # Coursework & certification modal
│           └── DeleteConfirmModal.tsx # Destructive action confirmation guard
```

---

## 2. What Each Major File Does

- **`src/types/index.ts`**: Defines the shapes of `Project`, `Skill`, `LearningJourneyItem`, `Certification`, and `ProfileSettings`. Ensures type safety throughout the entire app.
- **`src/lib/firebase.ts`**: Connects your application to Cloud Firestore and Firebase Authentication. It also contains the `handleFirestoreError` helper, which formats errors for debugging.
- **`src/services/portfolioService.ts`**: The only file that communicates directly with Firestore. If Firestore is empty when first loaded, it seamlessly provides fallback data from `defaultData.ts` so the portfolio is never blank.
- **`src/context/AuthContext.tsx`**: Manages sign-in state. When you log in with Google, it checks if your email matches `beingcrazyff@gmail.com` or has an admin record in Firestore.
- **`src/components/admin/AdminDashboard.tsx`**: The management portal where you can add new projects, update skills, change roadmap milestones, and toggle projects between Draft and Published.

---

## 3. How React and TypeScript Work in This Application

1. **Components**: The UI is divided into small, reusable components (like `Navbar`, `ProjectsSection`, `SkillModal`). Each component is responsible for one visual piece.
2. **State (`useState`)**: Stores dynamic data (e.g., active category filters, modal open/close states, and list of projects).
3. **Effects (`useEffect`)**: Fetches data from Firestore when the component mounts and cleans up listeners.
4. **TypeScript Strict Typing**: Every form input, function parameter, and database payload is verified by TypeScript. If you misspell a field or pass a number where a string is expected, TypeScript catches it immediately.

---

## 4. How Data Moves Through the Application

```
[ Admin Form ]
      │
      ▼ (Validates field lengths & types)
[ portfolioService.ts ]
      │
      ▼ (Executes Firestore setDoc / updateDoc)
[ Cloud Firestore ] ◄── Evaluates firestore.rules (Rejects unauthorized writes)
      │
      ▼ (Public query: where('published', '==', true))
[ App.tsx / Public Components ]
      │
      ▼ (Renders responsive UI)
[ Visitors View Published Portfolio ]
```

---

## 5. How Firebase Authentication Works

- Administrators sign in via **Google Sign-In Popup** (`signInWithPopup`).
- When a user logs in, Firebase returns a secure JSON Web Token (JWT) containing the user's `uid` and verified `email`.
- **Primary Admin Check**: The code verifies that `currentUser.email === 'beingcrazyff@gmail.com'`.
- If an unauthorized Google account attempts to sign in, the UI blocks them with an **Access Denied** message, and Firestore Security Rules reject any writes they attempt.

---

## 6. How Firestore Security Rules Protect Data

Security is enforced at the database level inside `firestore.rules`, not just in the frontend:
1. **Public Reads**: Anyone can read `/skills`, `/learning_journey`, `/certifications`, and `/settings/profile`.
2. **Draft Privacy**: Unauthenticated users can **only** read projects where `resource.data.published == true`. Draft projects (`published == false`) are completely inaccessible to the public.
3. **Write Protection**: Only the verified administrator (`beingcrazyff@gmail.com`) can create, update, or delete records.
4. **Input Size Limits**: Titles are restricted to 150 characters, summaries to 300 characters, preventing malicious database exhaustion.

---

## 7. How to Add or Edit Projects

1. Open the portfolio website.
2. Click **Admin Portal** in the navigation bar (or visit `#admin`).
3. Click **Sign in with Google** and select your authorized email (`beingcrazyff@gmail.com`).
4. In the **Projects** tab, click **Create Project**.
5. Fill in the title, category, short summary, problem statement, tools used, and links.
6. Choose:
   - **Published**: The project will immediately appear on the public portfolio.
   - **Draft (unchecked)**: The project will be saved privately in your database for you to work on later.
7. Click **Preview** to see the full analytical layout, then click **Create Project**.

---

## 8. How to Run the Project Locally

1. Clone or download the repository to your computer.
2. Open a terminal in the project directory.
3. Install dependencies:
   ```bash
   npm install
   ```
4. Start the development server:
   ```bash
   npm run dev
   ```
5. Open your browser at `http://localhost:3000`.

---

## 9. How to Configure Firebase

Your project is already pre-configured with `firebase-applet-config.json`.

If you ever want to connect your own independent Firebase project:
1. Go to the [Firebase Console](https://console.firebase.google.com).
2. Create a new Firebase project and enable **Cloud Firestore** and **Firebase Authentication** (Enable the **Google** sign-in provider).
3. Under Project Settings -> Web Apps, copy your configuration keys.
4. Replace the values in `firebase-applet-config.json`:
   ```json
   {
     "projectId": "your-project-id",
     "appId": "your-app-id",
     "apiKey": "your-api-key",
     "authDomain": "your-project.firebaseapp.com",
     "firestoreDatabaseId": "(default)",
     "storageBucket": "your-project.firebasestorage.app",
     "messagingSenderId": "your-sender-id"
   }
   ```
5. Deploy `firestore.rules` using the Firebase CLI:
   ```bash
   firebase deploy --only firestore:rules
   ```

---

## 10. How to Deploy to Vercel

1. Push your repository to GitHub:
   ```bash
   git init
   git add .
   git commit -m "Initial commit of Rifat portfolio"
   git branch -M main
   git remote add origin https://github.com/your-username/rifat-portfolio.git
   git push -u origin main
   ```
2. Go to [Vercel](https://vercel.com) and log in.
3. Click **Add New Project** and import your GitHub repository.
4. Framework Preset: **Vite**.
5. Build Command: `npm run build`.
6. Output Directory: `dist`.
7. Click **Deploy**. Your portfolio will be live worldwide on a fast CDN!

---

## 11. Common Errors & Troubleshooting

| Error | Cause | Resolution |
|---|---|---|
| **Permission Denied (Firestore)** | The logged-in user is not recognized as an admin by `firestore.rules`. | Make sure you are signed in with `beingcrazyff@gmail.com`. |
| **Missing or Insufficient Permissions** | Attempting to fetch drafts while unauthenticated. | Normal behavior for public visitors. Sign in as admin to view drafts. |
| **Google Sign-In Popup Closed by User** | The sign-in window was closed before completing authentication. | Simply click "Sign in with Google" again. |
| **Firebase Offline Error** | Local network disconnect or invalid config. | Check internet connection and verify `firebase-applet-config.json`. |
| **Vercel Build Error (`tsc --noEmit`)** | A TypeScript type mismatch. | Run `npm run lint` locally to see the exact line with a type mismatch. |
