# Travel‑Me

Travel‑Me is a full‑stack web app for skill exchange and short‑term hosting. Volunteers can find hosts and hosts can post job offers and accept travelers. Frontend is React + Tailwind; backend is Node/Express with MongoDB.

## Key features
- Volunteer & Host accounts
- Host profile, job offers, image upload (Cloudinary)
- Responsive UI (Tailwind)
- Chat with emoji support
- JWT auth and REST API

## Tech stack
- Frontend: React, TypeScript, Tailwind CSS, Vite
- Backend: Node, Express, MongoDB
- Storage: Cloudinary (images)
- Auth: JWT
- Dev tools: react-toastify, lucide-react icons

## Repo layout
- `Frontend/` — React app (pages, components, styles)
- `Backend/` — Express API (routes, controllers, models)

## Quick start — macOS / Linux
1. Clone repo
   ```bash
   git clone <repo-url>
   cd YOUR DICTORY
   ```
2. Backend
   ```bash
   cd Backend
   cp .env.example .env.development.local
   # edit .env.development.local with real values (do NOT commit)
   npm install
   npm run dev
   ```
3. Frontend
   ```bash
   cd ../Frontend
   cp .env.example .env.development.local
   # edit .env.development.local (VITE_API_BASE_URL etc.)
   npm install
   npm run dev
   # open http://localhost:5173 (check the port output)
   ```

## Quick start — Windows (PowerShell)
1. Clone repo
   ```powershell
   git clone <repo-url>
   cd .\fullstack\finalproject\Travel-Me
   ```
2. Backend
   ```powershell
   cd .\Backend
   copy .env.example .env.development.local
   # edit .env.development.local with Notepad/VS Code
   npm install
   npm run dev
   ```
3. Frontend
   ```powershell
   cd ..\Frontend
   copy .env.example .env.development.local
   # edit .env.development.local
   npm install
   npm run dev
   # open http://localhost:5173
   ```

Notes:
- Use Node 16+ (or the project's required Node version). Use nvm / nvm-windows to manage Node versions.
- If ports conflict, change dev server port via Vite/your scripts.

## Environment variables (examples — do NOT commit)
Backend `.env` example:
```
MONGO_URI=
ACCESS_JWT_SECRET=
CLIENT_BASE_URL=http://localhost:5173
DB_NAME=Travel-Me
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
PORT=8000
```

Frontend `.env` example:
```
VITE_API_BASE_URL=http://localhost:8000
VITE_CLIENT_BASE_URL=http://localhost:5173
```

## Security / housekeeping
- Add `.env*` to `.gitignore`.
- If secrets were committed, rotate them immediately and remove the file from git history (BFG/git-filter-repo).
- Keep secrets in the host/CI secret store (GitHub Secrets, environment config in hosting).

## Tests & scripts
- Backend/frontend test commands depend on repo scripts. Typical:
  ```bash
  cd Backend && npm test
  cd ../Frontend && npm test
  ```

## Deployment
- Build frontend and deploy to Vercel/Netlify or serve static assets.
- Deploy backend to Render/Heroku/Cloud provider; set env vars in service settings.
- Use secure secret storage in production.

## Troubleshooting
- Page not rendering: open browser DevTools → Console for runtime errors.
- Save button disabled: client validation requires certain fields (gender, age, address, country, continent, languages, job offers) — check form state.
- Image upload: frontend sends file in FormData as `pictureURL` — backend must accept multipart/form-data.

## Contributing
- Fork → branch → PR. Run linters/tests before PR.

## Contact
- Maintainer: add your contact or GitHub handle here.

License of all Development and Design by Travel-Me teammember: Boris Feuze, Mateusz Olszewski, Leon Rabl, Hua Guo;
10-11.2025
