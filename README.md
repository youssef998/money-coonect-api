# Connect Money

Connect Money is a full-stack financial application built with NestJS (backend) and React Native (Expo) (frontend). It provides user authentication, deposits, and transaction tracking.

## Features
- User authentication (register/login with JWT)
- Deposit money feature
- Transaction tracking
- PostgreSQL database (raw SQL queries, no ORM)

## Project Structure
```
connect-money/
├── backend/    # NestJS backend
├── frontend/   # React Native (Expo) frontend
├── docker-compose.yml
└── README.md
```

## Prerequisites
- [Node.js](https://nodejs.org/)
- [Docker](https://www.docker.com/)
- [Docker Compose](https://docs.docker.com/compose/)
- [Expo CLI](https://docs.expo.dev/get-started/installation/)

## Setup Instructions

### 1. Clone the Repository
```sh
git clone https://github.com/yourusername/connect-money.git
cd connect-money
```

### 2. Run the Project with Docker
```sh
docker-compose up --build
```
This will start the PostgreSQL database, backend, and frontend.

### 3. Manually Running the Backend (Without Docker)
```sh
cd backend
cp .env.example .env  # Configure environment variables
npm install
npm run start:dev
```

### 4. Manually Running the Frontend (Without Docker)
```sh
cd frontend/conectmoney/
npm install
expo start
```

## API Endpoints
- **POST /auth/login** - User login
- **POST /users/register** - User registration
- **POST /transactions/deposit** - Deposit money
- **GET /transactions** - Get transaction history

## Troubleshooting
- **Database connection refused?** Ensure PostgreSQL is running and credentials in `.env` match.
- **Expo errors?** Try running `expo start -c` to clear cache.
