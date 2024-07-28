
# Article CMS Backend

This repository encompasses the backend architecture for an Article Content Management System (CMS) featuring user roles, authentication, and CRUD operations.

## User Roles

The system defines three roles with different permissions:
- **Admin:** Full access to Create, Read, Update, and Delete (CRUD) operations.
- **Moderator:** Read and update access.
- **User:** Read-only access.

## Features

### User Authentication
- Secure password storage with hashing (bcrypt).
- JWT-based authentication.
- User password encryption.
- Cookies/Sessions management.

### Role Management
- Middleware for role-based access control (RBAC).

### CRUD Operations
- Efficient handling of task creation, retrieval, updates, and deletions.
- Search functionality for users and articles based on keywords.
- API endpoints for CRUD operations on an "articles" collection.
  - **Admin:** Can create, read, update, and delete articles.
  - **Moderator:** Can read and update articles.
  - **User:** Can only read articles.

### Backend
- **Node.js & Express.js:** Develop the server-side logic.
- **APIs:** Create RESTful APIs for handling authentication, articles management, and user roles.
- **Authenticated API calls.**

## Getting Started

### Prerequisites
- Node.js
- MongoDB
- Postman (for testing APIs)
- Cloudinary account (for file uploads)

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/article-cms.git
   cd article-cms
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the root directory and add the values for the variables as shown in the `dummy.env` file.

4. Start the server:
   ```bash
   npm start
   ```

### API Endpoints

#### Authentication:
- `POST /api/auth/register` - Register a new user.
- `POST /api/auth/login` - Login a user and return a JWT.
- `GET /api/auth/logout` - Logout a user and clear the session.
- `GET /api/auth/me` - Get the current user.

#### Articles:
- `POST /api/articles` - Create a new article (Admin only).
- `GET /api/articles` - Get all articles (All roles).
- `GET /api/articles/:id` - Get a single article by ID (All roles).
- `PUT /api/articles/:id` - Update an article by ID (Admin and Moderator).
- `DELETE /api/articles/:id` - Delete an article by ID (Admin only).
- `GET /api/articles/search?q=` - Search for articles.

#### Users (Admin only):
- `GET /api/users` - Get all users.
- `GET /api/users/:id` - Get a single user by ID.
- `PUT /api/users/:id` - Update a user by ID.
- `DELETE /api/users/:id` - Delete a user by ID.
- `GET /api/users/:id/articles` - Get all articles by a user.
- `GET /api/users/search?n=` - Search for users by name.

#### Files (Admin only):
- `POST /api/files/upload` - Upload file(s).
- `GET /api/files/:id` - Download a file by filename.
- `DELETE /api/files/:id` - Delete a file by filename.
- `GET /api/files` - Get all files.

## Testing

Use Postman to test the API endpoints.

### [Postman Workspace](https://www.postman.com/docking-module-meteorologist-16547239/workspace/envint/overview)
