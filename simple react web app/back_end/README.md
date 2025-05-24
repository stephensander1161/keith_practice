# Demo API Server

A simple Node.js REST API server with users, posts, and comments endpoints.

## Features

- RESTful API design
- CRUD operations for users, posts, and comments
- In-memory data storage (easy to replace with a real database)
- Pagination support
- Filtering and search capabilities
- CORS enabled
- Request logging with Morgan
- Error handling

## Installation

```bash
# Clone the repository
git clone [your-repo-url]
cd demo-api-server

# Install dependencies
npm install
```

## Usage

```bash
# Start the server
npm start

# Start in development mode (with auto-reload)
npm run dev
```

Server will run on `http://localhost:3000` by default.

## API Endpoints

### Root
- `GET /` - Welcome message and endpoint list

### Health & Stats
- `GET /api/health` - Server health check
- `GET /api/stats` - Database statistics

### Users
- `GET /api/users` - Get all users (supports pagination, filtering by role)
- `GET /api/users/:id` - Get single user with their posts
- `POST /api/users` - Create new user
- `PUT /api/users/:id` - Update user
- `DELETE /api/users/:id` - Delete user

### Posts
- `GET /api/posts` - Get all posts (supports filtering by user, tag, search)
- `GET /api/posts/:id` - Get single post with comments
- `POST /api/posts` - Create new post
- `PUT /api/posts/:id` - Update post
- `DELETE /api/posts/:id` - Delete post

### Comments
- `GET /api/comments` - Get all comments
- `POST /api/comments` - Create new comment
- `DELETE /api/comments/:id` - Delete comment

## Example Requests

### Create a new user
```bash
curl -X POST http://localhost:3000/api/users \
  -H "Content-Type: application/json" \
  -d '{"name": "John Doe", "email": "john@example.com", "role": "user"}'
```

### Get posts with pagination
```bash
curl "http://localhost:3000/api/users?page=1&limit=5"
```

### Search posts
```bash
curl "http://localhost:3000/api/posts?search=node"
```

### Filter posts by tag
```bash
curl "http://localhost:3000/api/posts?tag=javascript"
```

## Data Structure

### User
```json
{
  "id": "uuid",
  "name": "string",
  "email": "string",
  "role": "admin|user",
  "createdAt": "date"
}
```

### Post
```json
{
  "id": "uuid",
  "userId": "uuid",
  "title": "string",
  "content": "string",
  "tags": ["string"],
  "createdAt": "date"
}
```

### Comment
```json
{
  "id": "uuid",
  "postId": "uuid",
  "userId": "uuid",
  "content": "string",
  "createdAt": "date"
}
```

## Environment Variables

- `PORT` - Server port (default: 3000)

## Next Steps

To make this production-ready:
1. Replace in-memory storage with a real database (PostgreSQL, MongoDB, etc.)
2. Add authentication (JWT tokens)
3. Add input validation (Joi, express-validator)
4. Add rate limiting
5. Add API documentation (Swagger/OpenAPI)
6. Add tests
7. Add logging to file/service
8. Add environment configuration