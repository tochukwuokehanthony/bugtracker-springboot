# Bug Tracker Backend

Spring Boot REST API for the Bug Tracker application.

## Prerequisites

- Java 17 or higher
- Maven 3.6+
- PostgreSQL 12+

## Setup

### 1. Database Setup

Create a PostgreSQL database:

```bash
psql -U postgres
CREATE DATABASE bugtracker;
\q
```

### 2. Configure Application

Edit `src/main/resources/application.properties` and update:
- Database URL, username, password
- JWT secret key (IMPORTANT: Change this in production!)

### 3. Build and Run

```bash
# Build the project
mvn clean install

# Run the application
mvn spring-boot:run
```

The API will be available at `http://localhost:8080`

## Project Structure

```
src/main/java/com/bugtracker/app/
├── BugTrackerApplication.java    # Main application class
├── config/                        # Configuration classes
├── controller/                    # REST API endpoints
├── dto/                          # Data Transfer Objects
├── entity/                       # JPA entities
├── exception/                    # Custom exceptions
├── repository/                   # Data access layer
├── security/                     # Security configuration
└── service/                      # Business logic
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login and get JWT token

### Users
- `GET /api/users` - Get all users
- `GET /api/users/{id}` - Get user by ID
- `PUT /api/users/{id}` - Update user
- `DELETE /api/users/{id}` - Delete user

### Projects
- `GET /api/projects` - Get all projects
- `GET /api/projects/{id}` - Get project by ID
- `POST /api/projects` - Create new project
- `PUT /api/projects/{id}` - Update project
- `DELETE /api/projects/{id}` - Delete project

### Tickets
- `GET /api/tickets` - Get all tickets
- `GET /api/tickets/{id}` - Get ticket by ID
- `GET /api/projects/{projectId}/tickets` - Get tickets for a project
- `POST /api/tickets` - Create new ticket
- `PUT /api/tickets/{id}` - Update ticket
- `DELETE /api/tickets/{id}` - Delete ticket

### Comments
- `GET /api/tickets/{ticketId}/comments` - Get comments for a ticket
- `POST /api/comments` - Create new comment
- `PUT /api/comments/{id}` - Update comment
- `DELETE /api/comments/{id}` - Delete comment

## Authentication

The API uses JWT (JSON Web Tokens) for authentication. Include the token in the Authorization header:

```
Authorization: Bearer <your-jwt-token>
```

## Database Schema

See SQL files in `src/main/resources/db/` for the complete schema definition.