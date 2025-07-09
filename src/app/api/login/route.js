import mongoose from 'mongoose'
import { NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

const MONGO_URI = process.env.MONGO_URI
const JWT_SECRET = process.env.JWT_SECRET

if (!MONGO_URI) {
  console.error('MONGO_URI is not set in environment variables');
  throw new Error('MONGO_URI is not set');
}
if (!JWT_SECRET) {
  console.error('JWT_SECRET is not set in environment variables');
  throw new Error('JWT_SECRET is not set');
}

// Mongoose User model (reuse from signup)
const userSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
}, { timestamps: true })

const User = mongoose.models.User || mongoose.model('User', userSchema)

async function connectDB() {
  if (mongoose.connection.readyState === 0) {
    await mongoose.connect(MONGO_URI)
  }
}

export async function POST(req) {
  try {
    await connectDB()
    const body = await req.json()
    const { email, password } = body
    if (!email || !password) {
      return NextResponse.json({ message: 'Email and password are required' }, { status: 400 })
    }
    const user = await User.findOne({ email })
    if (!user) {
      return NextResponse.json({ message: 'User not found. Please sign up first.' }, { status: 404 })
    }
    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch) {
      return NextResponse.json({ message: 'Invalid password' }, { status: 401 })
    }
    // Generate JWT token with 1 day expiry, include user data (not password)
    const token = jwt.sign({
      userId: user._id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName
    }, JWT_SECRET, { expiresIn: '1d' })
    return NextResponse.json({
      token,
      user: {
        id: user._id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName
      }
    }, { status: 200 })
  } catch (err) {
    return NextResponse.json({ message: 'Server error', error: err.message }, { status: 500 })
  }
} 