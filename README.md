# 10xDevs Dashboard

A web application for monitoring developer activity on GitHub repositories, visualizing Pull Request timelines, and generating developer activity reports.

## Project Structure

- `frontend/` - React application with TypeScript and Tailwind CSS
- `backend/` - Node.js/Express server with TypeScript
- `shared/` - Shared types and utilities used by both frontend and backend

## Setup Instructions

### Prerequisites

- Node.js (v18+)
- npm (v9+)

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/10xDevs-project.git
cd 10xDevs-project
```

2. Install dependencies for all projects:
```bash
# Install frontend dependencies
cd frontend
npm install

# Install backend dependencies
cd ../backend
npm install

# Install shared dependencies
cd ../shared
npm install
```

3. Build the shared module:
```bash
cd shared
npm run build
```

### Running the Project

#### Backend

1. Start the development server:
```bash
cd backend
npm run dev
```

The backend will be available at http://localhost:4000.

#### Frontend

1. Start the development server:
```bash
cd frontend
npm run dev
```

The frontend will be available at http://localhost:3000.

## Development

- Frontend uses React 19, TypeScript 5, and Tailwind 4
- Backend uses Node.js, Express, and TypeScript
- Shared module contains types used by both frontend and backend

## Tech Stack

- **Frontend**: React, TypeScript, Tailwind CSS, Chart.js
- **Backend**: Node.js, Express, TypeScript
- **API Integration**: GitHub REST API