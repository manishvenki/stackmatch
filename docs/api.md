# StackMatch — API Specification

Base URL: `/api/v1`

All responses follow the standard JSON envelope:
```json
{
  "success": true,
  "data": { ... },
  "message": "Optional feedback"
}
```

---

## 1. Authentication Endpoints

### `POST /api/v1/auth/register`
Creates a new user account with hashed password and generates a JWT.
- **Body:** `{ "name": "Alex", "email": "alex@example.com", "password": "secretpassword" }`
- **Response:** `201 Created` with `{ user, token }`

### `POST /api/v1/auth/login`
Authenticates email and password, returning a JWT bearer token.
- **Body:** `{ "email": "alex@example.com", "password": "secretpassword" }`
- **Response:** `200 OK` with `{ user, token }`

### `POST /api/v1/auth/logout`
Acknowledges token invalidation.
- **Response:** `200 OK`

### `GET /api/v1/auth/me`
Retrieves the authenticated user's profile.
- **Headers:** `Authorization: Bearer <token>`
- **Response:** `200 OK` with User document

---

## 2. Project Endpoints

### `GET /api/v1/projects`
List projects for the user.
- **Response:** `200 OK` with array of projects

### `POST /api/v1/projects`
Creates a new project.
- **Body:** `{ "name": "Campus Courier", "description": "Package delivery for dorms" }`
- **Response:** `201 Created` with Project document

### `GET /api/v1/projects/:id`
Retrieves project details by ID.

### `PATCH /api/v1/projects/:id`
Updates project properties (e.g., status, stage, summary).

### `DELETE /api/v1/projects/:id`
Deletes project and cascading artifacts.

---

## 3. Conversation & Scoping Endpoints

### `GET /api/v1/projects/:id/messages`
Retrieves conversation message history for a project.

### `POST /api/v1/projects/:id/messages`
Sends user prompt to the project conversation. The backend generates a contextual response, suggests interactive response chips, and advances project scoping stages.
- **Body:** `{ "content": "We need both web and mobile access with online payments." }`
- **Response:** `201 Created` with `{ userMessage, assistantMessage }`

---

## 4. Domain & Planning Artifacts

- `GET /api/v1/projects/:id/requirements`
- `POST /api/v1/projects/:id/requirements`
- `GET /api/v1/projects/:id/tech-stack`
- `GET /api/v1/projects/:id/comparisons`
- `GET /api/v1/projects/:id/architecture`
- `GET /api/v1/projects/:id/roadmap`
- `GET /api/v1/projects/:id/resources`
- `GET /api/v1/projects/:id/blueprint`
