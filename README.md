# Bug Tracker Application

A full-stack bug tracking and project management application built with Spring Boot and React.

## Tech Stack

**Backend:**
- Spring Boot 3.x
- Spring Security with JWT
- Spring Data JPA
- PostgreSQL
- Maven

**Frontend:**
- React 18
- React Router v6
- Axios
- Bootstrap/Reactstrap
- Chart.js

## Project Structure

- `/backend` - Spring Boot REST API
- `/frontend` - React SPA

## Getting Started

### Prerequisites
- Java 17 or higher
- Maven 3.6+
- Node.js 16+
- PostgreSQL 12+

### Backend Setup
```bash
cd backend
mvn clean install
mvn spring-boot:run
```

### Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

## Features

- User authentication and authorization with JWT
- Project management
- Ticket/bug tracking
- Team collaboration with comments
- Dashboard with analytics and charts
- User and role management
- Real-time status updates

## API Documentation

Backend runs on `http://localhost:8080`
Frontend runs on `http://localhost:5173`

See individual README files in `backend/` and `frontend/` directories for detailed setup instructions.

## Database Schema

The application uses PostgreSQL with the following main entities:
- Users
- Projects
- Tickets
- Comments
- User-Project assignments
- Developer-Ticket assignments

## License

MIT