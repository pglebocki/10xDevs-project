# Technology Stack

## Frontend
- **React** – provides interactivity where needed.
- **TypeScript** – ensures static code typing and better IDE support.
- **Tailwind 4** – enables convenient application styling.
- **Chart.js** – used to generate interactive PR timeline diagrams with tooltip support.

## Backend
- **Node + TypeScript + Express** – separate service responsible for business logic, GitHub API communication, and data processing and caching.

## GitHub API
- Fetching data from GitHub (@octokit/rest)
- Authentication via token (token verification when needed).

## CI/CD and Hosting
- **GitHub Actions** – for creating CI/CD pipelines.
- **DigitalOcean** – for hosting applications using Docker image.