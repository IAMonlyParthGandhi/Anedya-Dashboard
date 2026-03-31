# Step 1 — Repository Setup & Project Scaffolding

## Files Created/Modified

### .gitignore
Root-level file to prevent sensitive data (`.env`), build artifacts (`dist/`), and heavy dependencies (`node_modules/`) from being committed to version control.

### backend/package.json
Initialized Node.js configuration. Added `dev` script using `nodemon` for automatic server restarts during development and `start` script for production.

### backend/server.js
The entry point for the Express API. Configured with `dotenv` for environment variables, `cors` for frontend communication, and a `/health` endpoint to verify server status.

### backend/.env
Centralized configuration for the backend, including server port, database credentials, JWT settings, and Anedya Cloud API details.

### frontend/.env
Frontend environment configuration, primarily defining the base URL for the backend API.

## Patterns & Conventions Established
- **Environment Driven**: All configuration (ports, URLs, secrets) is handled via `.env` files.
- **Health Monitoring**: Standard `/health` endpoint for uptime verification.
- **Separation of Concerns**: Root-level monorepo-style layout with distinct `frontend/` and `backend/` directories.
