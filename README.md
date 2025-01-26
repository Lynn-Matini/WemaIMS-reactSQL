# 🏢 Wema Insurance Management System

## 📝 Description

A comprehensive insurance management system for Wema Insurance, designed to streamline policy management, claims processing, and customer service.

## ⭐ Features

### 👨‍💼 Admin Portal

- Dashboard with Analytics
- Product Management
- Claims Processing
- User Management
- Allocation Tracking
- Report Generation

### 👥 User Portal

- Insurance Product Browsing
- Claim Submissions
- Profile Management
- Status Tracking
- PDF Statement Downloads

## 🛠️ Tech Stack

### Frontend

- ⚛️ React
- 🎨 Bootstrap
- 🔄 Axios
- 🛣️ React Router DOM
- 🖨️ React-to-Print
- 🔔 React-Toastify

### Backend

- 📦 Node.js
- 🚀 Express
- 💾 MySQL
- 🔒 JWT Authentication
- 🔐 Bcrypt
- 📁 Multer

## ⚙️ Prerequisites

- Node.js (v14 or higher)
- MySQL
- Git

## 📥 Installation

1. Clone the repository

   ```bash
   git clone <repository-url>
   ```

2. Install frontend dependencies

   ```bash
   cd wema
   npm install
   ```

3. Install backend dependencies

   ```bash
   cd server
   npm install
   ```

4. Configure MySQL Database

   - Create database named 'wema'
   - Update connection details in `server/utils/db.js`

5. Set up environment variables

   - Create `.env` files in both frontend and backend directories
   - Update with your configurations

6. Start the development servers

   Backend:

   ```bash
   cd server
   npm start
   ```

   Frontend:

   ```bash
   cd wema
   npm run dev
   ```

## 🌐 Environment Setup

### Frontend

- Running on: `http://localhost:5173`
- Development command: `npm run dev`

### Backend

- Running on: `http://localhost:3000`
- Development command: `npm start`

### Database Configuration

```javascript
{
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'wema'
}
```

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the ISC License.
