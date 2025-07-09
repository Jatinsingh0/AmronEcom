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

// Mongoose User model (define inline to avoid import issues)
const userSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
}, { timestamps: true })

const User = mongoose.models.User || mongoose.model('User', userSchema)

async function connectDB() {
  if (mongoose.connection.readyState === 0) {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(MONGO_URI)
    console.log('Connected to MongoDB');
  }
}

export async function POST(req) {
  try {
    await connectDB()
    const body = await req.json()
    const { firstName, lastName, email, password } = body
    console.log('Received signup request:', { firstName, lastName, email })
    if (!firstName || !lastName || !email || !password) {
      return NextResponse.json({ message: 'All fields are required' }, { status: 400 })
    }
    const existingUser = await User.findOne({ email })
    if (existingUser) {
      console.log('User already exists:', email)
      return NextResponse.json({ message: 'User already exists' }, { status: 409 })
    }
    const hashedPassword = await bcrypt.hash(password, 10)
    const user = new User({ firstName, lastName, email, password: hashedPassword })
    await user.save()
    console.log('User created:', user.email)
    const token = jwt.sign({ userId: user._id, email: user.email }, JWT_SECRET, { expiresIn: '7d' })
    return NextResponse.json({ token }, { status: 201 })
  } catch (err) {
    console.error('Signup error:', err)
    return NextResponse.json({ message: 'Server error', error: err.message }, { status: 500 })
  }
} 