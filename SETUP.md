# Bug Tracker - Setup Guide

A complete guide to get your Bug Tracker application up and running.

## Prerequisites

Make sure you have the following installed:

- **Java 17 or higher** - [Download](https://adoptium.net/)
- **Maven 3.6+** - [Download](https://maven.apache.org/download.cgi)
- **Node.js 16+** and **npm 8+** - [Download](https://nodejs.org/)
- **PostgreSQL 12+** - [Download](https://www.postgresql.org/download/)

## Database Setup

### 1. Create Database

```bash
# Connect to PostgreSQL
psql -U postgres

# Create database
CREATE DATABASE bugtracker;

# Exit psql
\q
```

### 2. Run Schema

```bash
# Run the schema file
psql -U postgres -d bugtracker -f backend/src/main/resources/db/schema.sql
```

This will create:
- All necessary tables (users, projects, tickets, comments, etc.)
- Indexes for performance
- A default admin user:
  - **Email**: admin@bugtracker.com
  - **Password**: admin123 (CHANGE THIS IN PRODUCTION!)

### 3. Configure Database Connection

Edit `backend/src/main/resources/application.properties`:

```properties
spring.datasource.url=jdbc:postgresql://localhost:5432/bugtracker
spring.datasource.username=postgres
spring.datasource.password=YOUR_PASSWORD_HERE
```

**IMPORTANT**: Also change the JWT secret key in production!

## Backend Setup (Spring Boot)

### 1. Navigate to Backend Directory

```bash
cd backend
```

### 2. Build the Project

```bash
mvn clean install
```

This will:
- Download all dependencies
- Compile the code
- Run tests
- Create a JAR file

### 3. Run the Application

```bash
mvn spring-boot:run
```

The backend will start on **http://localhost:8080**

You should see output like:
```
Tomcat started on port(s): 8080 (http)
Started BugTrackerApplication in X.XXX seconds
```

## Frontend Setup (React + Vite)

### 1. Navigate to Frontend Directory

Open a new terminal and run:

```bash
cd frontend
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Run Development Server

```bash
npm run dev
```

The frontend will start on **http://localhost:5173**

You should see:
```
VITE v5.x.x  ready in XXX ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
```

## Testing the Application

### 1. Open Your Browser

Navigate to **http://localhost:5173**

### 2. Login with Default Admin

- **Email**: admin@bugtracker.com
- **Password**: admin123

### 3. Or Register a New User

Click "Register here" and create a new account.

## API Documentation

### Authentication Endpoints

- `POST /api/auth/login` - Login
- `POST /api/auth/register` - Register

### User Endpoints

- `GET /api/users` - Get all users
- `GET /api/users/{id}` - Get user by ID
- `GET /api/users/me` - Get current user
- `PUT /api/users/{id}` - Update user
- `DELETE /api/users/{id}` - Delete user

### Project Endpoints

- `GET /api/projects` - Get all projects
- `GET /api/projects/{id}` - Get project by ID
- `POST /api/projects` - Create project
- `PUT /api/projects/{id}` - Update project
- `DELETE /api/projects/{id}` - Delete project
- `POST /api/projects/{projectId}/members/{userId}` - Add team member
- `DELETE /api/projects/{projectId}/members/{userId}` - Remove team member

### Ticket Endpoints

- `GET /api/tickets` - Get all tickets
- `GET /api/tickets/{id}` - Get ticket by ID
- `GET /api/tickets/project/{projectId}` - Get tickets by project
- `GET /api/tickets/user/{userId}` - Get tickets by user
- `POST /api/tickets` - Create ticket
- `PUT /api/tickets/{id}` - Update ticket
- `DELETE /api/tickets/{id}` - Delete ticket
- `POST /api/tickets/{ticketId}/assign/{userId}` - Assign developer
- `DELETE /api/tickets/{ticketId}/assign/{userId}` - Unassign developer

### Comment Endpoints

- `GET /api/comments/ticket/{ticketId}` - Get comments for ticket
- `POST /api/comments` - Create comment
- `PUT /api/comments/{id}` - Update comment
- `DELETE /api/comments/{id}` - Delete comment

## Project Structure

```
bugtracker-springboot/
├── backend/              # Spring Boot backend
│   ├── src/
│   │   ├── main/
│   │   │   ├── java/com/bugtracker/app/
│   │   │   │   ├── config/           # Security, CORS config
│   │   │   │   ├── controller/       # REST endpoints
│   │   │   │   ├── dto/              # Data transfer objects
│   │   │   │   ├── entity/           # JPA entities
│   │   │   │   ├── exception/        # Exception handling
│   │   │   │   ├── repository/       # Database access
│   │   │   │   ├── security/         # JWT, authentication
│   │   │   │   └── service/          # Business logic
│   │   │   └── resources/
│   │   │       ├── application.properties
│   │   │       └── db/schema.sql
│   │   └── test/
│   └── pom.xml
│
└── frontend/             # React frontend
    ├── src/
    │   ├── api/                  # API client
    │   ├── components/           # Reusable components
    │   ├── context/              # Auth context
    │   ├── pages/                # Page components
    │   └── App.jsx               # Main app with routing
    └── package.json
```

## Common Issues

### Backend Issues

**Port 8080 already in use:**
```bash
# Kill process on port 8080
lsof -ti:8080 | xargs kill -9
```

**Database connection failed:**
- Verify PostgreSQL is running
- Check database name, username, password in `application.properties`
- Ensure database exists

**JWT errors:**
- Make sure JWT secret is set in `application.properties`
- Token might be expired, try logging in again

### Frontend Issues

**Port 5173 already in use:**
```bash
# Kill process on port 5173
lsof -ti:5173 | xargs kill -9
```

**API connection errors:**
- Make sure backend is running on port 8080
- Check console for CORS errors
- Verify API_URL in `.env` if you created one

**Login fails:**
- Check backend logs for errors
- Verify database is set up correctly
- Try registering a new user

## Building for Production

### Backend

```bash
cd backend
mvn clean package
java -jar target/backend-1.0.0.jar
```

### Frontend

```bash
cd frontend
npm run build
```

The production build will be in `frontend/dist/`

## Next Steps

1. **Change default passwords** - Update admin password and JWT secret
2. **Add more features** - Charts, analytics, file uploads, notifications
3. **Write tests** - Unit and integration tests
4. **Deploy** - Deploy to cloud platforms (Heroku, AWS, Azure)
5. **Customize** - Modify UI, add your branding

## Support

If you encounter issues:

1. Check the logs (backend console and browser console)
2. Verify all prerequisites are installed
3. Make sure database is set up correctly
4. Ensure both backend and frontend are running

## License

MIT License - Feel free to use this project for learning and portfolio purposes.