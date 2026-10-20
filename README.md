# Online Course Service

## Student information
- Name: **Hein Nyan Swen**
- Student ID: **6732096**

## Structure
- `next-backend/`: Next.js API, MongoDB, JWT HTTP-only cookie session
- `react-frontend/`: React/Vite single-page client

## Test accounts (after running seed)

| Role | Username | Email | Password |
|---|---|---|---|
| Teacher | teacher1 | teacher1@example.com | DemoPass123! |
| Teacher | teacher2 | teacher2@example.com | DemoPass123! |
| Teacher | teacher3 | teacher3@example.com | DemoPass123! |
| Student | student1 | student1@example.com | DemoPass123! |
| Student | student2 | student2@example.com | DemoPass123! |
| Student | student3 | student3@example.com | DemoPass123! |

**Change demo passwords before public deployment.** Set `SEED_PASSWORD` before running the seed script if you want a different common password, and update this README accordingly. The seed script does not overwrite existing users' passwords.

## Prerequisites
- Node.js compatible with Next.js 16 / Vite 8 (use Node.js 22.12+)
- MongoDB Atlas cluster (replica set required for transactional enrollment)
- MongoDB Atlas network access granted for the application / Vercel

## Local setup
1. Clone the repository and open its root folder.
2. In `next-backend`, run `npm ci`.
3. Copy `next-backend/.env.example` to `next-backend/.env.local` and set real `MONGODB_URI`, `JWT_SECRET`, `FRONTEND_URL=http://localhost:5173` and optional `MONGODB_DB`.
4. From `next-backend`, run `npm run seed`, then `npm run dev` (backend listens at `http://localhost:3000`).
5. In a second terminal, enter `react-frontend` and run `npm ci`.
6. Copy `react-frontend/.env.example` to `react-frontend/.env.local` (`VITE_API_URL=http://localhost:3000`).
7. Run `npm run dev` in `react-frontend`, open `http://localhost:5173`.

## Walkthrough
1. Login as `teacher1` and create an Open course, edit it, view the details and enrolled student list.
2. Login as `student1`, search by course/teacher, view an Open course and enroll.
3. Confirm `student1` sees the course under My Enrollments; second enrollment must be rejected.
4. As `teacher1`, confirm the student appears in course details; deleting the enrolled course must fail.
5. Change the course to Close; it must remain visible to students but enrollment is blocked.
6. Change it to Cancel; it must disappear from the student catalog and direct student detail access must fail.
7. Login as `teacher2`; accessing or modifying `teacher1`'s course must return 403.
8. Confirm Student attempts to create/edit courses and Teacher attempts to enroll are rejected with 403 by backend.
9. Test capacity using a course with maximum 1 student and two student logins.
10. Try protected endpoints without login; expected status 401.

## API routes
| Method | Route | Access |
|---|---|---|
| POST | `/api/auth/login` | Public |
| POST | `/api/auth/logout` | Authenticated session optional |
| GET | `/api/auth/me` | Signed-in users |
| GET | `/api/course?q=...` | Student: non-canceled catalog / Teacher: own courses |
| POST | `/api/course` | Teacher |
| GET | `/api/course/:course_id` | Student: non-canceled / Teacher: own |
| PUT | `/api/course/:course_id` | Owning Teacher |
| DELETE | `/api/course/:course_id` | Owning Teacher, only if empty |
| POST | `/api/course/:course_id/enroll` | Student, only if Open and seats available |
| GET | `/api/enrollments` | Student's enrollments |
| GET | `/api/health` | Public deployment check |

## Deployment to Vercel
1. Push the project to your own GitHub repository (do not include `.env.local`).
2. Import the repo into Vercel as backend with **Root Directory** `next-backend` and Next.js framework.
3. Set backend environment variables: `MONGODB_URI`, `MONGODB_DB`, `JWT_SECRET`, `FRONTEND_URL` (the exact frontend Vercel URL, without trailing slash).
4. Import the same repo again into Vercel as frontend with **Root Directory** `react-frontend` and Vite framework.
5. Set frontend build environment variable `VITE_API_URL` to the backend Vercel HTTPS URL, without trailing slash. Redeploy frontend if changed.
6. Redeploy backend after configuring `FRONTEND_URL`. Check `/api/health`, login and full workflow.
7. Some browsers block cross-site third-party cookies between independent Vercel project domains. If login fails despite correct credentials, use a shared custom domain (e.g., `api.example.com` and `app.example.com`) and verify browser cookie policy; simply exposing JWT to JavaScript is not a secure workaround.
8. For two source repository links when required, create separate GitHub repositories containing the **unaltered `next-backend` and `react-frontend` folder contents** while retaining the combined original project as your working source. Deploy each corresponding repo.
