# Travel and Tourism Management System

A full-stack MERN (MongoDB, Express, React, Node.js) application designed to handle travel and tourism management. This platform allows users to browse travel packages, manage bookings, and handle payments seamlessly.

## Features

- **User Authentication**: Secure signup and login using JSON Web Tokens (JWT) and bcryptjs.
- **Payment Integration**: Secure payment gateway integration using Braintree.
- **State Management**: Robust frontend state management using Redux Toolkit and Redux Persist.
- **Modern UI**: Fully responsive and interactive user interface built with React, Tailwind CSS, Material UI, and Swiper for carousels.
- **Data Visualization**: Interactive charts for admins using Recharts.
- **File Uploads**: Image and file uploads supported via Multer and Firebase.

## Tech Stack

### Frontend (Client)
- **Framework**: React.js (Vite)
- **Routing**: React Router DOM
- **Styling**: Tailwind CSS, Material UI, Emotion
- **State Management**: Redux Toolkit, React-Redux, Redux-Persist
- **HTTP Client**: Axios
- **Other Utilities**: Braintree Web Drop-in, React Hot Toast, Swiper, Recharts, Timeago.js

### Backend (Server)
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB (Mongoose)
- **Authentication**: JWT (JSON Web Tokens)
- **Payment Gateway**: Braintree
- **File Handling**: Multer, Firebase
- **Security**: CORS, Cookie Parser

## Getting Started

### Prerequisites
- Node.js installed on your machine
- MongoDB instance (local or Atlas)
- Firebase account for API key
- Braintree account for payment processing

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/siddutorpedo/Travelling-Management-System-main.git
   cd Travelling-Management-System-main
   ```

2. **Install dependencies**
   The project has a convenient script to install dependencies for both the backend and frontend at once:
   ```bash
   npm run build
   ```
   *Alternatively, you can manually run `npm install` in the root directory, and then `cd client && npm install`.*

### Environment Variables

You need to set up environment variables for both the root (backend) and the client.

**Backend `.env` (Create in the root directory)**
```env
# MongoDB Connection
MONGO_URL=YOUR_ATLAS_MONGO_URL
# Or for local: mongodb://127.0.0.1:27017/travel-tourism-app

# JWT Secret
JWT_SECRET=YOUR_JWT_SECRET

# Braintree Payment Gateway Credentials
BRAINTREE_MERCHANT_ID=YOUR_BRAINTREE_MERCHANT_ID
BRAINTREE_PUBLIC_KEY=YOUR_BRAINTREE_PUBLIC_KEY
BRAINTREE_PRIVATE_KEY=YOUR_BRAINTREE_PRIVATE_KEY

# Environment & Server
NODE_ENV_CUSTOM=development # development or production
SERVER_URL=http://localhost:5173
```

**Frontend `.env` (Create in the `client/` directory)**
```env
VITE_FIREBASE_API_KEY="YOUR_FIREBASE_API_KEY"
```

### Running the Application

**Run both Client and Server concurrently (if setup):**
In the root directory, you can start the backend server:
```bash
npm run dev
```

In a separate terminal, navigate to the `client` directory and start the Vite development server:
```bash
cd client
npm run dev
```

The frontend will run on `http://localhost:5173` (or as configured by Vite), and the backend runs on its default port (typically 8000, as proxied by the client).

## License
This project is licensed under the ISC License.
