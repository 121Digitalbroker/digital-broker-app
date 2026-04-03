import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';

export async function POST(request: Request) {
  try {
    const { username, password } = await request.json();

    // 1. Check Hardcoded Super Admin (For prototype ease without initial seeding)
    if (username === 'superadmin' && password === 'superadmin123') {
      return NextResponse.json({ success: true, role: 'superadmin' });
    }

    // 2. Check Database for CMS Users
    await dbConnect();
    const user = await User.findOne({ username, password });
    
    if (user) {
      return NextResponse.json({ success: true, role: user.role });
    }

    // 3. Fallback to old simple prototype login temporarily until fully migrated
    if (username === 'admin' && password === 'admin123') {
       return NextResponse.json({ success: true, role: 'cms_user' });
    }

    return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
