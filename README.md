# Quiz App API

This project provides a RESTful API for managing users, including creating, retrieving, updating, and deleting user records. It is built using Node.js with Express, and it follows a well-organized folder structure to maintain separation of concerns.

## API Endpoints

Authentication and User Management

    •	POST /api/v1/auth/login

Authenticates a user and returns a token.
• POST /api/v1/auth/register
Registers a new user.
• POST /api/v1/auth/logout
Logs out the user and invalidates the current token.
• GET /api/v1/auth/verify/:token
Verifies a user’s email using a token.
• POST /api/v1/auth/forgot-password
Sends a password reset link to the user’s email.
• PATCH /api/v1/auth/reset-password/:token
Resets the password using a token.

Quiz Management

    •	GET /api/v1/quizzes

Retrieves a list of all available quizzes.

Score Management

    •	GET /api/v1/scores

Retrieves a list of all scores.
• POST /api/v1/scores
Submits a new score.

## Project Structure

    •	config/: Contains configuration files such as the database connection and server settings.
    •	controllers/: Contains the logic for handling incoming requests and returning responses.
    •	middleware/: Contains custom middleware such as validators and error handling.
    •	models/: Defines the data schema for the User entity.
    •	routes/: Defines the API routes and ties them to the corresponding controller methods.
    •	services/: Contains business logic and services, such as database interactions.
    •	app.js: The main application file that ties everything together and starts the server.

## How to Run the Project

### 1. Clone the Repository

```bash
git clone <repository_url>
cd terra-bootcamp
npm install
NODE_ENV=development
PORT=9090
DB_HOST=localhost
MONGO_URI=<your_mongodb_uri>
npm run dev
```
