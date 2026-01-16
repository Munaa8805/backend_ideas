# Idea Drop API

A RESTful API backend for managing ideas with user authentication and authorization. Built with Node.js, Express, and MongoDB.

## 📋 Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Configuration](#configuration)
- [API Documentation](#api-documentation)
- [Project Structure](#project-structure)
- [Authentication](#authentication)
- [Error Handling](#error-handling)
- [Usage Examples](#usage-examples)

## ✨ Features

- **User Authentication**
  - User registration with email and password
  - User login with JWT tokens
  - Token refresh mechanism
  - Protected routes with authentication middleware
  - Cookie-based refresh token storage

- **Idea Management**
  - Create, read, update, and delete ideas
  - Paginated idea listing
  - User-specific idea ownership
  - Authorization checks for updates and deletions
  - Tag support for ideas

- **Product Management**
  - Create, read, update, and delete products
  - Product listing with full details
  - Support for categories, brands, colors, sizes
  - Image array support
  - Quantity tracking

- **Book Management**
  - Create and read books
  - Book listing with ratings
  - Author and caption support
  - Image support with default fallback

- **Category Management**
  - Create, read, update, and delete categories
  - Category listing with full details
  - Unique category names (lowercase)
  - Image support with default fallback
  - Slug generation support

- **Security**
  - Password hashing with bcrypt
  - JWT-based authentication
  - HTTP-only cookies for refresh tokens
  - CORS enabled
  - Input validation

- **Server Maintenance**
  - Automated cron job to keep server alive
  - Periodic health checks every 14 minutes

## 🛠 Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js 5.x
- **Database**: MongoDB with Mongoose
- **Authentication**: JWT (jsonwebtoken, jose)
- **Security**: bcryptjs for password hashing
- **Environment**: dotenv
- **Middleware**: cors, cookie-parser
- **Scheduling**: cron for automated tasks

## 📦 Prerequisites

- Node.js (v14 or higher)
- MongoDB (local or cloud instance like MongoDB Atlas)
- npm or yarn

## 🚀 Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd idea-drop
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   Create a `.env` file in the root directory:
   ```env
   PORT=6000
   MONGO_URI=mongodb://localhost:27017/idea-drop
   JWT_SECRET=your-super-secret-jwt-key-here
   NODE_ENV=development
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

5. **Start the production server**
   ```bash
   npm start
   ```

The server will run on `http://localhost:6000` (or the port specified in your `.env` file).

## ⚙️ Configuration

### Environment Variables

| Variable | Description | Required | Default |
|----------|-------------|----------|---------|
| `PORT` | Server port number | No | 6000 |
| `MONGO_URI` | MongoDB connection string | Yes | - |
| `JWT_SECRET` | Secret key for JWT token signing | Yes | - |
| `NODE_ENV` | Environment (development/production) | No | development |

## 📚 API Documentation

### Base URL
```
http://localhost:6000/api/v1
```

### Authentication Endpoints

#### Register User
```http
POST /auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

**Response (201 Created)**
```json
{
  "message": "User created successfully",
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "data": {
    "_id": "507f1f77bcf86cd799439011",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "user",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
}
```

#### Login
```http
POST /auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}
```

**Response (200 OK)**
```json
{
  "message": "User logged in successfully",
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "data": {
    "_id": "507f1f77bcf86cd799439011",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "user"
  }
}
```

#### Refresh Token
```http
POST /auth/refresh
```

**Response (200 OK)**
```json
{
  "message": "Token refreshed successfully",
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "data": {
    "_id": "507f1f77bcf86cd799439011",
    "name": "John Doe",
    "email": "john@example.com"
  }
}
```

#### Logout
```http
POST /auth/logout
```

**Response (200 OK)**
```json
{
  "message": "User logged out successfully"
}
```

#### Get All Users
```http
GET /auth
```

**Response (200 OK)**
```json
{
  "message": "Users fetched successfully",
  "data": [
    {
      "_id": "507f1f77bcf86cd799439011",
      "name": "John Doe",
      "email": "john@example.com",
      "role": "user"
    }
  ]
}
```

### Idea Endpoints

#### Get All Ideas
```http
GET /ideas?_limit=10
```

**Query Parameters**
- `_limit` (optional): Number of ideas to return (default: 10)

**Response (200 OK)**
```json
{
  "message": "Ideas fetched successfully",
  "data": [
    {
      "_id": "507f1f77bcf86cd799439012",
      "title": "My Idea",
      "summary": "Short summary",
      "description": "Full description",
      "tags": ["tag1", "tag2"],
      "user": "507f1f77bcf86cd799439011",
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z"
    }
  ]
}
```

#### Get Single Idea
```http
GET /ideas/:id
```

**Response (200 OK)**
```json
{
  "message": "Idea fetched successfully",
  "data": {
    "_id": "507f1f77bcf86cd799439012",
    "title": "My Idea",
    "summary": "Short summary",
    "description": "Full description",
    "tags": ["tag1", "tag2"],
    "user": "507f1f77bcf86cd799439011",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
}
```

#### Create Idea (Protected)
```http
POST /ideas
Authorization: Bearer <access_token>
Content-Type: application/json

{
  "title": "My New Idea",
  "summary": "Brief summary of the idea",
  "description": "Detailed description of the idea",
  "tags": "tag1, tag2, tag3"
}
```

**Note**: Tags can be provided as a comma-separated string or an array.

**Response (201 Created)**
```json
{
  "message": "Idea created successfully",
  "data": {
    "_id": "507f1f77bcf86cd799439012",
    "title": "My New Idea",
    "summary": "Brief summary of the idea",
    "description": "Detailed description of the idea",
    "tags": ["tag1", "tag2", "tag3"],
    "user": "507f1f77bcf86cd799439011",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
}
```

#### Update Idea (Protected)
```http
PUT /ideas/:id
Authorization: Bearer <access_token>
Content-Type: application/json

{
  "title": "Updated Title",
  "summary": "Updated summary",
  "description": "Updated description",
  "tags": ["new", "tags"]
}
```

**Response (200 OK)**
```json
{
  "message": "Idea updated successfully",
  "data": {
    "_id": "507f1f77bcf86cd799439012",
    "title": "Updated Title",
    "summary": "Updated summary",
    "description": "Updated description",
    "tags": ["new", "tags"],
    "user": "507f1f77bcf86cd799439011",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T01:00:00.000Z"
  }
}
```

#### Delete Idea (Protected)
```http
DELETE /ideas/:id
Authorization: Bearer <access_token>
```

**Response (200 OK)**
```json
{
  "message": "Idea deleted successfully",
  "data": {}
}
```

### Product Endpoints

#### Get All Products
```http
GET /products
```

**Response (200 OK)**
```json
{
  "message": "Products fetched successfully",
  "data": [
    {
      "_id": "507f1f77bcf86cd799439013",
      "name": "Product Name",
      "price": 99.99,
      "image": ["https://example.com/image1.jpg", "https://example.com/image2.jpg"],
      "category": ["Electronics", "Gadgets"],
      "subCategory": "Smartphones",
      "brand": "Brand Name",
      "color": "Black",
      "size": "Large",
      "quantity": 50,
      "description": "Product description",
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z"
    }
  ]
}
```

#### Get Single Product
```http
GET /products/:id
```

**Response (200 OK)**
```json
{
  "message": "Product fetched successfully",
  "data": {
    "_id": "507f1f77bcf86cd799439013",
    "name": "Product Name",
    "price": 99.99,
    "image": ["https://example.com/image1.jpg"],
    "category": ["Electronics"],
    "brand": "Brand Name",
    "quantity": 50,
    "description": "Product description",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
}
```

#### Create Product
```http
POST /products
Content-Type: application/json

{
  "name": "Product Name",
  "price": 99.99,
  "image": ["https://example.com/image1.jpg"],
  "category": ["Electronics"],
  "subCategory": "Smartphones",
  "brand": "Brand Name",
  "color": "Black",
  "size": "Large",
  "quantity": 50,
  "description": "Product description"
}
```

**Required Fields**: `name`, `price`, `category`, `brand`, `description`

**Response (201 Created)**
```json
{
  "message": "Product created successfully",
  "data": {
    "_id": "507f1f77bcf86cd799439013",
    "name": "Product Name",
    "price": 99.99,
    "image": ["https://example.com/image1.jpg"],
    "category": ["Electronics"],
    "brand": "Brand Name",
    "quantity": 50,
    "description": "Product description",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
}
```

#### Update Product
```http
PUT /products/:id
Content-Type: application/json

{
  "name": "Updated Product Name",
  "price": 89.99,
  "quantity": 45
}
```

**Response (200 OK)**
```json
{
  "message": "Product updated successfully",
  "data": {
    "_id": "507f1f77bcf86cd799439013",
    "name": "Updated Product Name",
    "price": 89.99,
    "quantity": 45,
    "updatedAt": "2024-01-01T01:00:00.000Z"
  }
}
```

#### Delete Product
```http
DELETE /products/:id
```

**Response (200 OK)**
```json
{
  "message": "Product deleted successfully",
  "data": {
    "_id": "507f1f77bcf86cd799439013",
    "name": "Product Name"
  }
}
```

### Book Endpoints

#### Get All Books
```http
GET /books
```

**Response (200 OK)**
```json
{
  "message": "Books fetched successfully",
  "data": [
    {
      "_id": "507f1f77bcf86cd799439014",
      "name": "Book Title",
      "caption": "Book caption",
      "author": "Author Name",
      "rating": 4.5,
      "image": "https://example.com/book-cover.jpg",
      "publishedAt": "2024-01-01T00:00:00.000Z",
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z"
    }
  ]
}
```

#### Create Book
```http
POST /books
Content-Type: application/json

{
  "name": "Book Title",
  "caption": "Book caption",
  "author": "Author Name",
  "rating": 4.5,
  "image": "https://example.com/book-cover.jpg"
}
```

**Required Fields**: `name`, `caption`, `author`, `rating` (1-5)

**Response (200 OK)**
```json
{
  "message": "Books fetched successfully",
  "data": {
    "_id": "507f1f77bcf86cd799439014",
    "name": "Book Title",
    "caption": "Book caption",
    "author": "Author Name",
    "rating": 4.5,
    "image": "https://example.com/book-cover.jpg",
    "publishedAt": "2024-01-01T00:00:00.000Z",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
}
```

### Category Endpoints

#### Get All Categories
```http
GET /categories
```

**Response (200 OK)**
```json
{
  "message": "Categories fetched successfully",
  "data": [
    {
      "_id": "507f1f77bcf86cd799439015",
      "name": "electronics",
      "description": "Electronic products and gadgets",
      "image": "https://example.com/category-image.jpg",
      "slug": "electronics",
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z"
    }
  ]
}
```

#### Get Single Category
```http
GET /categories/:id
```

**Response (200 OK)**
```json
{
  "message": "Category fetched successfully",
  "data": {
    "_id": "507f1f77bcf86cd799439015",
    "name": "electronics",
    "description": "Electronic products and gadgets",
    "image": "https://example.com/category-image.jpg",
    "slug": "electronics",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
}
```

#### Create Category
```http
POST /categories
Content-Type: application/json

{
  "name": "Electronics",
  "description": "Electronic products and gadgets"
}
```

**Required Fields**: `name` (min 3, max 50 chars), `description` (min 3, max 200 chars)

**Note**: Category name is automatically converted to lowercase and must be unique.

**Response (201 Created)**
```json
{
  "message": "Category created successfully",
  "data": {
    "_id": "507f1f77bcf86cd799439015",
    "name": "electronics",
    "description": "Electronic products and gadgets",
    "image": "https://res.cloudinary.com/drneyxkqq/image/upload/v1768087485/samples/balloons.jpg",
    "slug": "electronics",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
}
```

#### Update Category
```http
PUT /categories/:id
Content-Type: application/json

{
  "name": "Updated Electronics",
  "description": "Updated description"
}
```

**Note**: Fields are optional. Only provided fields will be updated (minimum 3 characters required for updates).

**Response (200 OK)**
```json
{
  "message": "Category updated successfully",
  "data": {
    "_id": "507f1f77bcf86cd799439015",
    "name": "updated electronics",
    "description": "Updated description",
    "image": "https://example.com/category-image.jpg",
    "slug": "updated-electronics",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T01:00:00.000Z"
  }
}
```

#### Delete Category
```http
DELETE /categories/:id
```

**Response (200 OK)**
```json
{
  "message": "Category deleted successfully",
  "data": null
}
```

### Error Responses

All error responses follow this format:

```json
{
  "message": "Error message here",
  "stack": "Error stack trace (only in development)"
}
```

**Common HTTP Status Codes:**
- `400` - Bad Request (validation errors)
- `401` - Unauthorized (authentication required)
- `403` - Forbidden (authorization failed)
- `404` - Not Found (resource doesn't exist)
- `500` - Internal Server Error

## 📁 Project Structure

```
idea-drop/
├── config/
│   └── db.js                 # MongoDB connection configuration
├── controllers/
│   └── categories.js        # Category controller functions
├── middleware/
│   ├── authMiddleware.js     # JWT authentication middleware
│   ├── errorHandler.js       # Global error handling middleware
│   └── asyncHandler.js       # Async error handler wrapper
├── models/
│   ├── Idea.js              # Idea schema and model
│   ├── User.js              # User schema and model
│   ├── Product.js           # Product schema and model
│   ├── Book.js              # Book schema and model
│   └── Category.js          # Category schema and model
├── routes/
│   ├── authRouters.js       # Authentication routes
│   ├── ideaRoutes.js        # Idea CRUD routes
│   ├── productRouters.js    # Product CRUD routes
│   ├── bookRoutes.js        # Book routes
│   └── categories.js        # Category CRUD routes
├── utils/
│   ├── generateToken.js     # JWT token generation utility
│   ├── getJWTSecret.js      # JWT secret key utility
│   └── cron.js              # Cron job for server health checks
├── server.js                # Express app entry point
├── package.json             # Dependencies and scripts
└── .env                     # Environment variables (not in git)
```

## 🔐 Authentication

The API uses JWT (JSON Web Tokens) for authentication:

1. **Access Token**: Short-lived token (1 hour) sent in the `Authorization` header
   ```
   Authorization: Bearer <access_token>
   ```

2. **Refresh Token**: Long-lived token (30 days) stored in HTTP-only cookies

3. **Token Refresh**: Use the `/auth/refresh` endpoint to get a new access token using the refresh token cookie

### Protected Routes

Routes marked with `protect` middleware require authentication:
- `POST /ideas` - Create idea
- `PUT /ideas/:id` - Update idea
- `DELETE /ideas/:id` - Delete idea

## ⚠️ Error Handling

The API uses centralized error handling:

1. **Error Handler Middleware**: Located in `middleware/errorHandler.js`
2. **Error Response Format**: Consistent JSON error responses
3. **Status Codes**: Proper HTTP status codes for different error types
4. **Stack Traces**: Only shown in development mode

Error handling pattern in routes:
```javascript
try {
  // Route logic
} catch (error) {
  next(error); // Passes error to error handler middleware
}
```

## 💡 Usage Examples

### Using cURL

**Register a new user:**
```bash
curl -X POST http://localhost:6000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "password123"
  }'
```

**Login:**
```bash
curl -X POST http://localhost:6000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "password123"
  }' \
  -c cookies.txt
```

**Create an idea (with token):**
```bash
curl -X POST http://localhost:6000/api/v1/ideas \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -d '{
    "title": "My Idea",
    "summary": "Short summary",
    "description": "Full description",
    "tags": "tag1, tag2"
  }'
```

**Get all ideas:**
```bash
curl -X GET "http://localhost:6000/api/v1/ideas?_limit=5"
```

**Create a category:**
```bash
curl -X POST http://localhost:6000/api/v1/categories \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Electronics",
    "description": "Electronic products and gadgets"
  }'
```

**Get all categories:**
```bash
curl -X GET "http://localhost:6000/api/v1/categories"
```

### Using JavaScript (Fetch API)

```javascript
// Login
const loginResponse = await fetch('http://localhost:6000/api/v1/auth/login', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  credentials: 'include', // Important for cookies
  body: JSON.stringify({
    email: 'john@example.com',
    password: 'password123'
  })
});

const { accessToken } = await loginResponse.json();

// Create idea
const ideaResponse = await fetch('http://localhost:6000/api/v1/ideas', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${accessToken}`
  },
  body: JSON.stringify({
    title: 'My Idea',
    summary: 'Short summary',
    description: 'Full description',
    tags: ['tag1', 'tag2']
  })
});

const ideaData = await ideaResponse.json();
console.log(ideaData);
```

## 🧪 Testing

Currently, no test suite is configured. To add tests:

1. Install a testing framework (Jest, Mocha, etc.)
2. Set up test database
3. Write tests for routes and middleware
4. Add test script to `package.json`

## 📝 Notes

- Passwords must be at least 3 characters long
- All fields (title, summary, description) are required when creating/updating ideas
- Tags can be provided as comma-separated strings or arrays
- Ideas are sorted by creation date (newest first) when fetching all ideas
- Only the idea owner can update or delete their ideas
- Refresh tokens are stored in HTTP-only cookies for security
- Product price and quantity must be greater than 0
- Product images can be provided as an array of URLs
- Product categories can be provided as an array
- Book rating must be between 1 and 5
- Book image has a default fallback if not provided
- Category names are automatically converted to lowercase and must be unique
- Category name and description must be at least 3 characters long
- Category updates are partial - only provided fields are updated
- A cron job runs automatically to send health check requests every 14 minutes to keep the server alive

## 🔒 Security Considerations

- Passwords are hashed using bcrypt
- JWT tokens are signed with a secret key
- Refresh tokens are stored in HTTP-only cookies
- CORS is enabled for cross-origin requests
- Input validation on all endpoints
- Authorization checks for protected operations

## 📄 License

ISC

## 👤 Author

Munaa Tsetsegmaa

---

For more information or issues, please contact the development team.
