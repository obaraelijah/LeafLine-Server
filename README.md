# LeafLine

The LeafLine Book Store is an online platform that aims to provide a user-friendly and efficient way for customers to explore, purchase, and manage books.

**LeafLine API Docs**: [Link](https://documenter.getpostman.com/view/19574016/2s9YR6ZDip)

### **Technologies and Tools**

- Backend: Node.js, Express.js
- Database: MongoDB, Redis
- Payment Gateway Integration: Stripe
- Software Design: Clean Architecture
- Authentication: JSON Web Tokens (JWT)
- Devops: Github Actions, Docker
- Tests: Jest, Supertest
- Version Control: Git
- Tools: Swagger (API Documentation), VS Code, Postman, Notion

## Setting Up Your Node.js App

Follow these steps to set up and run the Node.js application locally on your machine.

### Prerequisites

- [Node.js](https://nodejs.org/) installed on your machine.

### Installation

1. **Clone the Repository:**
   ```bash
   git clone <repository-url>
   cd <repository-folder>
   ```

2. **Install Dependencies:**
   ```bash
   npm install
   ```

### Configuration

1. **Environment Variables:**
   - Create a `.env` file in the root directory of the project.
   - Define the necessary environment variables in the `.env` file. For example:
     ```env
     NODE_ENV=
     MONGO_URL = 
     JWT_SECRET = 
     EMAIL = 
     PASSWORD =
     FRONTEND_URL = http://localhost:5173
     # localhost:5173 does not work on production
     STRIPE_API_KEY=
     ```

### Running the Application

1. **Development Mode:**
   ```bash
   npm run dev
   ```
   This will start the server in development mode using nodemon, which will automatically restart the server when changes are detected.

2. **Production Mode:**
   ```bash
   npm start
   ```
   This will start the server in production mode.

By default, the application will be accessible at `http://localhost:3000`. You can change the port number in the `.env` file if needed.

### Testing

Explain how to run tests, if applicable.

```bash
npm test
```

