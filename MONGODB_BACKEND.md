# TRAVEL TOGETHER — MongoDB Backend Integration Guide

This guide shows how to migrate from the mock MongoDB service (`src/services/db.ts`) to a real MongoDB backend.

## Current Architecture

The app currently uses a mock MongoDB-like service layer that mimics MongoDB operations using localStorage. This provides:
- **CRUD operations** for Users, Trips, Messages
- **Authentication** (login/logout)
- **Matching algorithm**
- **Real-time messaging**

## Migration to Real MongoDB

### 1. Set Up MongoDB Atlas

```bash
# Create a free MongoDB Atlas cluster at: https://www.mongodb.com/cloud/atlas
# Get your connection string: mongodb+srv://<user>:<password>@cluster.mongodb.net/travel-together
```

### 2. Backend Server Setup

Create a new directory for the backend:

```bash
mkdir server && cd server
npm init -y
npm install express mongoose bcrypt jsonwebtoken cors dotenv
npm install -D nodemon typescript @types/express @types/node @types/cors
```

### 3. Create Express Server

**server/src/index.ts:**
```typescript
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/auth';
import userRoutes from './routes/users';
import tripRoutes from './routes/trips';
import messageRoutes from './routes/messages';
import matchRoutes from './routes/matches';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI!)
  .then(() => console.log('✅ MongoDB Connected'))
  .catch(err => console.error('❌ MongoDB Error:', err));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/trips', tripRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/matches', matchRoutes);

app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
```

### 4. Create Mongoose Models

**server/src/models/User.ts:**
```typescript
import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  password: { type: String, required: true },
  avatar: { type: String, default: 'from-violet-400 to-violet-600' },
  age: { type: Number },
  location: { type: String, default: '' },
  bio: { type: String, default: '' },
  interests: [{ type: String }],
  travelStyle: [{ type: String }],
  budget: { type: String, enum: ['low', 'medium', 'high', 'luxury'], default: 'medium' },
  pace: { type: String, enum: ['relaxed', 'moderate', 'fast'], default: 'moderate' },
  verified: { type: Boolean, default: false },
  rating: { type: Number, default: 0 },
  tripCount: { type: Number, default: 0 },
  plan: { type: String, enum: ['free', 'voyager', 'nomad'], default: 'free' },
}, { timestamps: true });

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

// Compare password method
userSchema.methods.comparePassword = async function(candidatePassword: string) {
  return bcrypt.compare(candidatePassword, this.password);
};

export const User = mongoose.model('User', userSchema);
```

**server/src/models/Trip.ts:**
```typescript
import mongoose from 'mongoose';

const tripSchema = new mongoose.Schema({
  title: { type: String, required: true },
  destination: { type: String, required: true },
  country: { type: String, required: true },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  budget: { type: Number, required: true },
  budgetPerPerson: { type: Number, required: true },
  maxGroupSize: { type: Number, required: true },
  currentGroupSize: { type: Number, default: 1 },
  description: { type: String, required: true },
  activities: [{ type: String }],
  creatorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  members: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  status: { type: String, enum: ['planning', 'confirmed', 'ongoing', 'completed'], default: 'planning' },
  emoji: { type: String, default: '🌍' },
  gradient: { type: String, default: 'from-brand-600 to-brand-400' },
}, { timestamps: true });

export const Trip = mongoose.model('Trip', tripSchema);
```

**server/src/models/Message.ts:**
```typescript
import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema({
  tripId: { type: mongoose.Schema.Types.ObjectId, ref: 'Trip', required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  content: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
}, { timestamps: true });

messageSchema.index({ tripId: 1, timestamp: 1 });

export const Message = mongoose.model('Message', messageSchema);
```

### 5. Create Auth Routes

**server/src/routes/auth.ts:**
```typescript
import { Router } from 'express';
import jwt from 'jsonwebtoken';
import { User } from '../models/User';

const router = Router();

// POST /api/auth/register
router.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'Email already registered' });
    }

    const user = await User.create({ name, email, password });
    
    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET!,
      { expiresIn: '30d' }
    );

    res.status(201).json({
      user: { ...user.toObject(), password: undefined },
      token,
    });
  } catch (error) {
    res.status(500).json({ error: 'Registration failed' });
  }
});

// POST /api/auth/login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET!,
      { expiresIn: '30d' }
    );

    res.json({
      user: { ...user.toObject(), password: undefined },
      token,
    });
  } catch (error) {
    res.status(500).json({ error: 'Login failed' });
  }
});

export default router;
```

### 6. Create Auth Middleware

**server/src/middleware/auth.ts:**
```typescript
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export interface AuthRequest extends Request {
  userId?: string;
}

export const auth = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (!token) throw new Error();

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { userId: string };
    req.userId = decoded.userId;
    next();
  } catch {
    res.status(401).json({ error: 'Authentication required' });
  }
};
```

### 7. Update Frontend Service

Update `src/services/db.ts` to make API calls:

```typescript
const API_URL = 'http://localhost:5000/api';

// Get stored token
const getToken = () => localStorage.getItem('tt_token');

// User Operations
export const db = {
  authLogin: async (email: string, password: string) => {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    const data = await response.json();
    if (data.error) return { error: data.error };
    localStorage.setItem('tt_token', data.token);
    return data;
  },

  authRegister: async (userData: any) => {
    const response = await fetch(`${API_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData),
    });
    const data = await response.json();
    if (data.error) return { error: data.error };
    localStorage.setItem('tt_token', data.token);
    return data;
  },

  tripFindAll: async () => {
    const response = await fetch(`${API_URL}/trips`, {
      headers: { 'Authorization': `Bearer ${getToken()}` },
    });
    return response.json();
  },

  tripJoin: async (tripId: string, userId: string) => {
    const response = await fetch(`${API_URL}/trips/${tripId}/join`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${getToken()}`,
      },
      body: JSON.stringify({ userId }),
    });
    return response.json();
  },

  // ... add other API methods
};
```

### 8. Add Real-time Chat with Socket.io

```bash
npm install socket.io socket.io-client
npm install -D @types/socket.io
```

**Server:**
```typescript
import { Server } from 'socket.io';

const io = new Server(server, { cors: { origin: '*' } });

io.on('connection', (socket) => {
  socket.on('join-trip', (tripId) => {
    socket.join(`trip-${tripId}`);
  });

  socket.on('send-message', async (data) => {
    const message = await Message.create(data);
    io.to(`trip-${data.tripId}`).emit('new-message', message);
  });
});
```

**Frontend:**
```typescript
import { io } from 'socket.io-client';

const socket = io('http://localhost:5000');

socket.emit('join-trip', tripId);
socket.on('new-message', (message) => {
  setMessages(prev => [...prev, message]);
});
```

### 9. Environment Variables

Create `.env` in the server directory:
```env
PORT=5000
MONGO_URI=mongodb+srv://<user>:<password>@cluster.mongodb.net/travel-together
JWT_SECRET=your-super-secret-jwt-key-change-this
NODE_ENV=development
```

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register new user |
| POST | `/api/auth/login` | Login user |
| GET | `/api/users/me` | Get current user |
| PUT | `/api/users/me` | Update user profile |
| GET | `/api/trips` | Get all trips |
| POST | `/api/trips` | Create new trip |
| GET | `/api/trips/:id` | Get trip details |
| POST | `/api/trips/:id/join` | Join a trip |
| POST | `/api/trips/:id/leave` | Leave a trip |
| GET | `/api/trips/search?q=` | Search trips |
| GET | `/api/messages/:tripId` | Get trip messages |
| POST | `/api/messages` | Send message |
| GET | `/api/matches` | Get travel matches |
| GET | `/api/stats` | Get platform stats |

## Deployment

1. **MongoDB Atlas**: Free tier available
2. **Backend**: Deploy to Render, Railway, or AWS
3. **Frontend**: Already configured for static hosting
4. **Real-time**: Use WebSockets or Server-Sent Events

---

The mock service in `src/services/db.ts` provides a fully functional experience for demonstration. The migration steps above show how to connect to a real MongoDB backend when ready for production.
