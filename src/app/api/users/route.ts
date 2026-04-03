import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';

export async function GET() {
  try {
    await dbConnect();
    const users = await User.find({ role: 'cms_user' }).select('-password').sort({ createdAt: -1 });
    return NextResponse.json(users);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    await dbConnect();
    const body = await request.json();
    
    // In a real app we'd hash the password here. As requested: storing plain for prototype logic.
    const user = await User.create({
      username: body.username,
      password: body.password,
      role: 'cms_user'
    });
    
    // Don't return the password
    const userObj = user.toObject();
    delete userObj.password;
    
    return NextResponse.json(userObj, { status: 201 });
  } catch (error: any) {
    if (error.code === 11000) {
      return NextResponse.json({ error: 'Username already exists' }, { status: 400 });
    }
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
