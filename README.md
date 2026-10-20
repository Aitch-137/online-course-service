# How to Test the App

## Student Information

- **Student Name:** Hein Nyan Swen
- **Student ID:** 6732096

## Test Credentials

The application provides 3 Teacher accounts and 3 Student accounts for testing.

| Role | Username / Email | Password |
|---|---|---|
| Teacher | teacher1 | DemoPass123! |
| Teacher | teacher2 | DemoPass123! |
| Teacher | teacher3 | DemoPass123! |
| Student | student1 | DemoPass123! |
| Student | student2 | DemoPass123! |
| Student | student3 | DemoPass123! |

These are demonstration accounts created using the database seed script.

## Prerequisites

- Node.js and npm installed
- MongoDB Atlas account with an active database cluster
- Git installed
- VS Code or another code editor
- Internet connection
- MongoDB connection string
- JWT secret for authentication

## How to Run & Test

### 1. Backend Setup (`next-backend/`)

1. Open the project folder in VS Code.
2. Open the terminal and navigate to the backend folder:

```bash
cd next-backend
```

3. Install the required dependencies:

```bash
npm install
```

4. Create a `.env.local` file inside `next-backend/` and configure:

```env
MONGODB_URI=your_mongodb_connection_string
MONGODB_DB=online_courses
JWT_SECRET=your_generated_jwt_secret
FRONTEND_URL=http://localhost:5173
```

5. Create the test users in MongoDB:

```bash
npm run seed
```

6. Start the backend server:

```bash
npm run dev
```

7. The backend runs at:

```text
http://localhost:3000
```

### 2. Frontend Setup (`react-frontend/`)

1. Open a second terminal in VS Code.
2. Navigate to the frontend folder:

```bash
cd react-frontend
```

3. Install the required dependencies:

```bash
npm install
```

4. Create a `.env.local` file inside `react-frontend/`:

```env
VITE_API_URL=http://localhost:3000
```

5. Start the React application:

```bash
npm run dev
```

6. Open the frontend in your browser:

```text
http://localhost:5173
```

Keep both backend and frontend terminals running while testing.

### 3. Testing Walkthrough

**Authentication**

- Open the application and log in using a test account.
- Confirm that unauthenticated users cannot access protected operations.
- Verify that Students and Teachers have different permissions.
- Log out and confirm that authentication is cleared.

**Teacher Functions**

1. Log in using `teacher1` / `DemoPass123!`.
2. View the Teacher's own course list.
3. Create a new course with the following example information:
   - Course Name: Introduction to Python
   - Duration: 30 days
   - Topics: Python Basics, Variables, Loops
   - Price: 1500
   - Max Student: 2
   - Status: Open
4. View the newly created course details.
5. Update the course information.
6. View students enrolled in the course.
7. Verify that a course can only be deleted when no students are enrolled.
8. Log in using `teacher2` and verify that this Teacher cannot update courses owned by `teacher1`.

**Student Functions**

1. Log in using `student1` / `DemoPass123!`.
2. View the available course list.
3. Search courses using part of the course name or Teacher name.
4. View the details of a selected course.
5. Enroll in an Open course with available seats.
6. Verify that the same Student cannot enroll twice in one course.
7. View the Student's enrolled courses.

**Enrollment and Course Status Rules**

- **Open:** Visible to Students and available for enrollment when seats remain.
- **Close:** Visible to Students but enrollment is not permitted.
- **Cancel:** Hidden from the Student course list and enrollment is not permitted.
- Students cannot enroll when the course reaches its maximum capacity.
- Students cannot enroll in the same course more than once.
- Teachers cannot delete courses with enrolled Students.
- Teachers can only manage their own courses.
- All authorization, ownership, and enrollment restrictions are enforced by the backend API.

**Deployment Testing**

1. Open the deployed frontend URL.
2. Log in using a Teacher test account.
3. Create and update a course.
4. Log out and log in using a Student test account.
5. View courses and enroll in an Open course.
6. Verify that the Student enrollment appears in the Teacher's course details.
7. Confirm that the deployed frontend communicates successfully with the deployed backend.
