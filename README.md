# Digital Heroes

A full-stack subscription-based platform that combines monthly draws, score tracking, charity contributions, winner verification, and administrative management in one application.

## 🚀 Live Demo

**Frontend:**
https://digital-heroes-frontend-brown.vercel.app

**Backend:**
https://digital-heroes-backend-4z8y.onrender.com

## 📌 GitHub Repository

https://github.com/Archana-baikana/digital-heroes

---

## 📖 About the Project

Digital Heroes is a full-stack web application where registered users can subscribe to a monthly or yearly plan, maintain their latest five Stableford scores, select a charity and contribution percentage, participate in monthly draws, and track their winnings.

Administrators can manage users, create and manage draws, publish draw results, verify winners, and process winner payouts.

The application is designed with separate user and administrator workflows and uses a REST API-based backend with a PostgreSQL database through Supabase.

---

## ✨ Features

### 👤 User Features

* User registration and login
* JWT-based authentication
* Monthly subscription
* Yearly subscription
* Subscription status tracking
* Protected routes
* Add Stableford scores
* Edit score for the same date
* Delete scores
* Automatically retain the latest 5 scores
* Select a charity
* Choose charity contribution percentage
* Search charities
* View featured charities
* View published monthly draws
* View winner information
* Upload proof for winnings
* User dashboard
* Responsive design

### 👨‍💼 Admin Features

* Admin authentication
* Admin dashboard
* View registered users
* View winners
* Create draws
* Run draws
* Simulate draws
* Publish draws
* View draw results
* Verify winners
* Approve or reject winner verification
* Mark approved winnings as paid
* View application statistics

---

## 🎯 Draw System

The application supports three winning categories:

| Match Type | Prize Pool |
| ---------- | ---------: |
| 5 Matches  |        40% |
| 4 Matches  |        35% |
| 3 Matches  |        25% |

Draw numbers are generated from a range of **1–45**.

If there is no winner for the 5-match category, the applicable prize amount can be carried forward as a rollover according to the draw rules.

---

## ❤️ Charity Integration

Users can select a charity and choose their contribution percentage.

The contribution starts from a minimum of **10%** and can be increased according to the application's supported range.

The application provides:

* Charity directory
* Charity search
* Featured charities
* Charity selection
* Contribution percentage
* User charity information on dashboard

---

## 🛠️ Tech Stack

### Frontend

* React.js
* React Router
* JavaScript
* HTML5
* CSS3
* Create React App

### Backend

* Node.js
* Express.js
* REST APIs
* JWT Authentication
* bcrypt

### Database

* PostgreSQL
* Supabase

### Deployment

* Vercel — Frontend
* Render — Backend
* Supabase — Database

---

## 📂 Project Structure

```text
digital-heroes/
│
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── App.js
│   │   ├── App.css
│   │   └── index.js
│   └── package.json
│
├── backend/
│   ├── controllers/
│   ├── routes/
│   ├── middleware/
│   ├── utils/
│   ├── db/
│   ├── server.js
│   └── package.json
│
├── .gitignore
└── README.md
```

---

## 🗄️ Database

The application uses Supabase PostgreSQL.

Main tables include:

* `users`
* `subscriptions`
* `scores`
* `charities`
* `user_charities`
* `draws`
* `winners`

Important database rules include:

* Unique user email
* User/admin roles
* Monthly/yearly subscription plans
* Stableford scores restricted to 1–45
* One score per user per date
* Latest five scores retained
* Charity contribution minimum of 10%
* Winner verification status
* Winner payout status
* Draw prize pool and rollover tracking

---

## 🔐 Authentication

The application uses JWT-based authentication.

Authentication flow:

```text
Signup
   ↓
Login
   ↓
JWT Token
   ↓
Protected Routes
   ↓
Authenticated User
```

Admin routes additionally verify the user's admin role.

Passwords are securely hashed using bcrypt.

---

## 🔌 API Features

The backend provides REST APIs for:

### Authentication

```text
POST /api/auth/signup
POST /api/auth/login
```

### Subscription

```text
POST /api/subscriptions
GET  /api/subscriptions/my
```

### Scores

```text
GET    /api/scores/my
POST   /api/scores
DELETE /api/scores/:id
```

### Charities

```text
GET  /api/charities
GET  /api/charities/my
POST /api/charities/select
```

### Draws

```text
POST /api/draws/create
POST /api/draws/simulate
POST /api/draws/run
PUT  /api/draws/:id/publish
GET  /api/draws/published
```

### Winners

```text
GET /api/winners/my
PUT /api/winners/:id/proof
```

### Admin

```text
GET /api/admin/users
GET /api/admin/winners
PUT /api/admin/winners/:id/approve
PUT /api/admin/winners/:id/reject
PUT /api/admin/winners/:id/pay
```

---

## ⚙️ Installation

### 1. Clone the repository

```bash
git clone https://github.com/Archana-baikana/digital-heroes.git
```

### 2. Navigate to the project

```bash
cd digital-heroes
```

### 3. Install frontend dependencies

```bash
cd frontend
npm install
```

### 4. Install backend dependencies

Open another terminal:

```bash
cd backend
npm install
```

### 5. Configure environment variables

Create a `.env` file inside the backend directory:

```env
PORT=3001
SUPABASE_URL=your_supabase_url
SUPABASE_KEY=your_supabase_key
JWT_SECRET=your_jwt_secret
```

For the frontend, configure:

```env
REACT_APP_API_URL=your_backend_url
```

**Do not commit `.env` files or secret keys to GitHub.**

---

## ▶️ Run Locally

### Start Backend

```bash
cd backend
npm start
```

Backend runs on:

```text
http://localhost:3001
```

### Start Frontend

```bash
cd frontend
npm start
```

Frontend runs on:

```text
http://localhost:3000
```

---

## 📱 Responsive Design

The application is designed to work across:

* Desktop
* Laptop
* Tablet
* Mobile devices

Responsive layouts were tested across the main user and admin pages.

---

## 🔮 Future Enhancements

* Real Stripe payment integration
* Automated monthly draw scheduling
* Email notifications
* Advanced analytics
* Automated charity donation processing
* Enhanced admin reports
* Production-grade winner payout integration

---

## 👩‍💻 Author

**Archana Baikana**

Full-Stack Web Development Project

### Technologies

React.js • Node.js • Express.js • PostgreSQL • Supabase • JWT • REST APIs
