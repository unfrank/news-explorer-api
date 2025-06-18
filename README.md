# NewsExplorer Backend

This is the backend API for the NewsExplorer full-stack project.

## Project Overview

- Full-stack app built as part of the TripleTen Software Engineering Program.
- Backend built with Express.js and MongoDB.
- Frontend deployed on GitHub Pages.
- Supports user registration, authentication, saving articles, and proxying NewsAPI requests.

---

## Technologies Used

- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT Authentication
- Celebrate / Joi Validation
- NewsAPI Integration (proxy route)
- ESLint

---

## Running the Backend Locally

### 1. Clone the repository:

```bash
git clone https://github.com/unfrank/news-explorer-api.git
```

### 2. Navigate to the project directory:

```bash
cd news-explorer-api
```

### 3. Install dependencies:

```bash
npm install
```

### 4. Create a `.env` file in the root directory following the provided `.env.example` structure:

```env
PORT=3000
MONGO_URI=mongodb://127.0.0.1:27017/newsdb
JWT_SECRET=your_jwt_secret_here
NEWS_API_KEY=your_news_api_key_here
```

### 5. Start the server:

```bash
npm run dev
```

### 6. The backend will be running at:

```bash
https://news-explorer-api-n5y3.onrender.com

```

---

## API Routes

| Route       | Method            | Description            |
| ----------- | ----------------- | ---------------------- |
| `/signup`   | POST              | Register a new user    |
| `/signin`   | POST              | Login and retrieve JWT |
| `/articles` | GET, POST, DELETE | Manage saved articles  |
| `/news`     | GET               | Proxy route to NewsAPI |

---

## Proxy Route (/news)

The `/news` route securely forwards search requests to NewsAPI using the backend-stored `NEWS_API_KEY`. This protects API keys from being exposed on the client.

### Example usage:

```bash
# Development (local):
GET http://localhost:3000/news?query=tesla

# Deployed (Render):
GET https://news-explorer-api-n5y3.onrender.com/news?query=tesla

```

---

## Environment Variables

Make sure to configure your `.env` file before starting the server. See `.env.example` for required keys.
