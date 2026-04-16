import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import SiteSettings from '@/models/SiteSettings';

export async function GET() {
  try {
    await dbConnect();
    let settings = await SiteSettings.findOne();
    
    if (!settings) {
      settings = await SiteSettings.create({});
    }
    
    return NextResponse.json(settings);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch settings' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    await dbConnect();
    const body = await request.json();
    
    let settings = await SiteSettings.findOne();
    
    if (settings) {
      settings.siteTitle = body.siteTitle || settings.siteTitle;
      settings.siteDescription = body.siteDescription || settings.siteDescription;
      settings.keywords = body.keywords || settings.keywords;
      settings.googleVerification = body.googleVerification || settings.googleVerification;
      settings.updatedAt = new Date();
      await settings.save();
    } else {
      settings = await SiteSettings.create(body);
    }
    
    return NextResponse.json(settings);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update settings' }, { status: 500 });
  }
}
