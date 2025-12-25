# Notes App 📝

A full-stack note-taking application built with React, Express, and MongoDB. Create, edit, and manage your notes with ease.

## 🌐 Live Demo
- **Frontend**: https://nagendar-notes.vercel.app/dashboard
- **Backend API**: https://notes-app-l864.onrender.com/

## 📋 Features

- ✅ User Authentication (Sign up & Login)
- ✅ Create, Read, Update, Delete Notes
- ✅ Search and Filter Notes
- ✅ Tag-based Organization
- ✅ User Profile Management
- ✅ Responsive Design with Tailwind CSS
- ✅ Real-time UI Updates

## 🛠️ Tech Stack

### Frontend
- **React 19** - UI Library
- **Vite** - Build tool
- **Tailwind CSS** - Styling
- **Axios** - HTTP Client
- **React Router** - Routing
- **React Icons** - Icon Library
- **React Modal** - Modal Component
- **Moment.js** - Date formatting

### Backend
- **Node.js** - Runtime
- **Express 5** - Web Framework
- **MongoDB** - Database
- **Mongoose** - ODM
- **JWT** - Authentication
- **CORS** - Cross-origin requests
- **Morgan** - HTTP logging
- **Dotenv** - Environment variables

## 🚀 Getting Started

### Prerequisites
- Node.js (v14+)
- MongoDB Atlas account
- Git

### Installation

#### Backend Setup
```bash
cd backend
npm install
```

Create `.env` file in backend directory:
```env
MONGO_URI=your_mongodb_connection_string
ACCESS_TOKEN_SECRET=your_secret_key
```

#### Frontend Setup
```bash
cd frontend
npm install
```

### Development

#### Start Backend
```bash
cd backend
npm start
```
Server runs on: `http://localhost:8000`

#### Start Frontend
```bash
cd frontend
npm run dev
```
App runs on: `http://localhost:5173`

### Build for Production

#### Frontend
```bash
cd frontend
npm run build
```
Output: `dist/` folder

#### Backend
```bash
cd backend
node app.js
```

## 📦 Deployment

### Frontend (Vercel)
1. Connect GitHub repository to Vercel
2. Set Root Directory: `frontend`
3. Build Command: `npm run build`
4. Output Directory: `dist`
5. Deploy

### Backend (Render)
1. Create new Web Service on Render
2. Connect GitHub repository
3. Start Command: `node app.js`
4. Add environment variables (MONGO_URI, ACCESS_TOKEN_SECRET)
5. Deploy

## 📂 Project Structure

```
Notes-App/
├── backend/
│   ├── models/
│   │   ├── userModel.js
│   │   └── noteModel.js
│   ├── app.js
│   ├── utilities.js
│   ├── config.json
│   └── package.json
│
└── frontend/
    ├── src/
    │   ├── components/
    │   │   ├── Cards/
    │   │   ├── Input/
    │   │   ├── Navbar/
    │   │   ├── SearchBar/
    │   │   ├── ToastMessage/
    │   │   └── EmptyCard/
    │   ├── pages/
    │   │   ├── Home/
    │   │   ├── Login/
    │   │   └── SignUp/
    │   ├── utils/
    │   │   ├── axiosInstance.js
    │   │   ├── constants.js
    │   │   └── Helper.js
    │   ├── App.jsx
    │   └── main.jsx
    ├── public/
    └── package.json
```

## 🔌 API Endpoints

### Authentication
- `POST /create-account` - Sign up new user
- `POST /login` - User login

### Notes
- `POST /add-note` - Create a new note
- `GET /get-all-notes` - Fetch all user notes
- `PUT /edit-note/:noteId` - Update a note
- `DELETE /delete-note/:noteId` - Delete a note

### User
- `GET /get-user` - Fetch current user info

## 🔐 Security Features
- JWT Authentication
- Password hashing
- CORS enabled
- Environment variables for sensitive data

## 📝 Environment Variables

### Backend (.env)
```
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/database
ACCESS_TOKEN_SECRET=your_secret_key_here
```

### Frontend (constants.js)
```
BASE_URL=https://notes-app-l864.onrender.com/
```

## 🤝 Contributing
Feel free to fork and submit pull requests for any improvements.

## 📄 License
ISC

## 👤 Author
**Nagendar23**

## 📞 Support
For issues and questions, please open an issue on GitHub.
