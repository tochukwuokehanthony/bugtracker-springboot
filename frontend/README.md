# Bug Tracker Frontend

Modern React application for the Bug Tracker.

## Prerequisites

- Node.js 16+
- npm 8+

## Setup

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure API Endpoint

The app connects to the backend API at `http://localhost:8080` by default.

To change this, create a `.env` file:

```
VITE_API_URL=http://localhost:8080
```

### 3. Run Development Server

```bash
npm run dev
```

The app will be available at `http://localhost:5173`

## Build for Production

```bash
npm run build
```

The production build will be in the `dist/` directory.

## Project Structure

```
src/
├── App.jsx                  # Main application component
├── main.jsx                 # Application entry point
├── api/                     # API configuration and calls
├── components/              # Reusable UI components
│   ├── common/             # Common components (Navbar, Sidebar, etc.)
│   ├── forms/              # Form components
│   ├── tables/             # Table components
│   └── charts/             # Chart components
├── pages/                   # Page components
├── context/                 # React context for state management
├── hooks/                   # Custom React hooks
├── utils/                   # Utility functions
└── styles/                  # CSS/SCSS files
```

## Features

- Modern React with Hooks
- React Router v6 for navigation
- Axios for API communication
- Bootstrap/Reactstrap for UI
- Chart.js for data visualization
- React Hook Form for form validation
- React Toastify for notifications
- JWT authentication with protected routes

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Technologies

- React 18
- Vite (build tool)
- React Router v6
- Axios
- Bootstrap 5
- Reactstrap
- Chart.js
- React Hook Form
- React Toastify
