# Todo API

A backend REST API for managing Todos, built with **Node.js, Express.js, and MongoDB**.

Part of my **100 Days Backend Project Challenge**.

## 🛠️ Tech Stack

* Node.js
* Express.js
* MongoDB
* Mongoose
* JWT
* Docker

## ✨ Features

* [ ] Authentication
* [ ] Todo CRUD
* [ ] User-specific Todos
* [ ] Status & Priority
* [ ] Search & Filtering
* [ ] Sorting & Pagination
* [ ] Soft Delete
* [ ] Validation
* [ ] Error Handling
* [ ] Docker

## 📁 Project Structure

```text
src/
├── controllers/
├── models/
├── routes/
├── middlewares/
├── validators/
├── utils/
├── db/
├── app.js
└── server.js
```

## 🔌 API Endpoints

| Method | Endpoint                | Description |
| ------ | ----------------------- | ----------- |
| POST   | `/api/v1/todos`         | Create Todo |
| GET    | `/api/v1/todos`         | Get Todos   |
| GET    | `/api/v1/todos/:todoId` | Get Todo    |
| PATCH  | `/api/v1/todos/:todoId` | Update Todo |
| DELETE | `/api/v1/todos/:todoId` | Delete Todo |

> Add new endpoints here as the project grows.

## ⚙️ Setup

```bash
git clone <repository-url>
cd todo-api
npm install
npm run dev
```

Create `.env`:

```env
PORT=3000
MONGODB_URI=your_mongodb_uri
JWT_ACCESS_SECRET=your_secret
JWT_REFRESH_SECRET=your_secret
```

## 🚧 Status

**Under Development**

### Progress

* [☑️] Project Setup
* [☑️] Todo Model
* [ ] CRUD
* [ ] Authentication
* [ ] Authorization
* [ ] Advanced Queries
* [ ] Testing
* [ ] Docker
* [ ] Documentation

> Update this README whenever a major feature is completed.
