# Nestway Immigration Platform

A production-oriented full-stack platform for Nestway Immigration. It combines a responsive public consultancy website with a secure CRM, content management, lead capture, appointment booking, analytics, and email notifications.

## Features

### Public website

- Premium responsive website for services, destinations, universities, training, blogs, FAQs, and success stories
- Dynamic service and country detail pages backed by REST APIs
- Multi-step consultation appointment flow
- Contact and enquiry forms connected to the lead-management pipeline
- SEO metadata, accessible interactions, loading states, and reduced-motion support

### Administration and CRM

- JWT-based admin authentication and protected routes
- Role-based access for administrators and consultants
- Lead search, filtering, assignment, priorities, status progression, notes, and follow-up tracking
- Appointment, CMS, media, and office management
- Dashboard analytics and administrator activity logs
- SMTP notifications for newly submitted leads

## Technology stack

| Layer | Technology |
| --- | --- |
| Frontend | React 19, Vite, Tailwind CSS, React Router, TanStack Query |
| UI and motion | Framer Motion, GSAP |
| Forms and API | React Hook Form, Axios |
| Backend | Node.js, Express 5, MVC architecture |
| Database | MongoDB, Mongoose |
| Authentication | JSON Web Tokens, bcrypt |
| Security | Helmet, CORS, validation and centralized error handling |
| Notifications | Nodemailer with SMTP |

## Repository structure

```text
Nestway-Immigration-Platform/
├── client/             React/Vite public website and admin dashboard
│   ├── public/         Static assets
│   └── src/            Components, pages, routes, services and admin UI
├── server/             Express REST API
│   ├── src/            MVC modules, middleware, services and scripts
│   └── test/           Backend tests
├── package.json        Workspace development commands
└── README.md
```

## Prerequisites

- Node.js 20 or later
- npm 10 or later
- MongoDB 8 locally, in Docker, or through a managed MongoDB deployment

## Local installation

1. Clone the private repository and enter the project directory.
2. Install root, backend, and frontend dependencies:

   ```bash
   npm install
   npm run install:all
   ```

3. Create local environment files from the committed templates:

   ```powershell
   Copy-Item server/.env.example server/.env
   Copy-Item client/.env.example client/.env
   ```

4. Replace all placeholder secrets and credentials in `server/.env`.
5. Start MongoDB, then run both applications:

   ```bash
   npm run dev
   ```

The frontend runs at `http://localhost:5173`, the API at `http://localhost:5000`, and the health endpoint at `http://localhost:5000/api/health`.

## Environment variables

Never commit `.env` files. Use the included `.env.example` templates as the source of required keys.

### Backend (`server/.env`)

| Variable | Purpose |
| --- | --- |
| `PORT` | Express API port |
| `MONGO_URI` | MongoDB connection URI |
| `CLIENT_URL` | Allowed frontend origin |
| `JWT_SECRET` | Long random JWT signing secret |
| `JWT_EXPIRES_IN` | Access-token lifetime |
| `SEED_ADMIN_*` | One-time initial administrator details |
| `SEED_CONSULTANT_*` | Optional initial consultant details |
| `EMAIL_HOST`, `EMAIL_PORT`, `EMAIL_SECURE` | SMTP transport settings |
| `EMAIL_USER`, `EMAIL_PASSWORD`, `EMAIL_FROM` | SMTP authentication and sender identity |
| `ADMIN_EMAIL` | Recipient for lead alerts |
| `EMAIL_TIMEZONE` | Time zone used in notification emails |
| `ADMIN_DASHBOARD_URL` | Link included in lead notifications |

Generate a strong JWT secret locally, for example:

```powershell
node -e "console.log(require('crypto').randomBytes(48).toString('hex'))"
```

### Frontend (`client/.env`)

| Variable | Purpose |
| --- | --- |
| `VITE_API_URL` | Public API base URL ending in `/api` |
| `VITE_COMPANY_PROFILE_PDF_URL` | Public company-profile document URL |

Only values intended to be public may use the `VITE_` prefix because Vite embeds them in the browser bundle.

## Local MongoDB with Docker

With Docker Desktop running, create the development container once:

```powershell
docker run -d --name nestway-mongodb --restart unless-stopped -p 127.0.0.1:27017:27017 -v nestway_mongodb_data:/data/db mongo:8
```

For later sessions:

```powershell
docker start nestway-mongodb
```

The local connection URI is `mongodb://127.0.0.1:27017/nestway_immigration`. The named Docker volume keeps database data outside this repository.

## Development commands

| Command | Description |
| --- | --- |
| `npm run dev` | Start frontend and backend together |
| `npm run dev:client` | Start only Vite |
| `npm run dev:server` | Start only the API in watch mode |
| `npm run build` | Build the production frontend |
| `npm start` | Start the backend without watch mode |
| `npm test --prefix server` | Run backend tests |
| `npm run seed:admin --prefix server` | Seed or update the first admin from environment variables |
| `npm run seed:consultant --prefix server` | Seed or update a consultant from environment variables |
| `npm run test:email --prefix server` | Send an SMTP delivery test |
| `npm run audit:responsive --prefix client` | Run the browser responsive audit |

## Production build and deployment

1. Provision MongoDB and configure a least-privilege database user.
2. Configure backend environment variables in the hosting platform's encrypted secret store.
3. Set `NODE_ENV=production` and `CLIENT_URL` to the deployed HTTPS origin. `VITE_API_URL` may be omitted when the website and API share one origin.
4. Install and build the workspace:

   ```bash
   npm ci
   npm run build
   ```

5. Deploy the repository as one Node.js application and run `npm start` from the repository root. Express serves the built frontend, SPA fallback, and `/api` from the same origin.
6. Enable HTTPS, configure the production SMTP provider, and verify `/api/health` before opening traffic.
7. Seed the first administrator from temporary deployment secrets, then remove the seed password from the environment.

## Verification

Run these checks before a release:

```bash
npm test --prefix server
npm run build
```

After startup, confirm that `/api/health` reports a connected database and test login, lead submission, appointment creation, CRM assignment, and email delivery.

## Security notes

- Local `.env` files, dependencies, builds, logs, database files, uploads, certificates, and private keys are excluded from Git.
- Passwords are hashed with bcrypt and are never stored in plaintext.
- JWT and SMTP secrets must be supplied only through environment variables or the deployment provider's secret manager.
- Rotate any credential immediately if it is ever committed or shared outside the intended environment.

## License and access

This is a private proprietary project for Nestway Immigration. Unauthorized copying, distribution, or reuse is prohibited.
