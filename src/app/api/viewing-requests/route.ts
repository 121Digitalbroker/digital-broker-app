import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import ViewingRequest from '@/models/ViewingRequest';

export async function POST(request: Request) {
  try {
    await dbConnect();
    const body = await request.json();
    
    const { name, phone, email, preferredDate, preferredTime, propertyId, propertyName, message } = body;
    
    // Validate required fields
    if (!name || !phone || !preferredDate || !preferredTime) {
      return NextResponse.json(
        { error: 'Name, phone, preferred date and time are required' },
        { status: 400 }
      );
    }
    
    // Create new viewing request
    const viewingRequest = await ViewingRequest.create({
      name,
      phone,
      email,
      preferredDate,
      preferredTime,
      propertyId,
      propertyName,
      message,
      status: 'pending'
    });
    
    return NextResponse.json(
      { success: true, message: 'Viewing request submitted successfully', data: viewingRequest },
      { status: 201 }
    );
  } catch (error) {
    console.error('Viewing request error:', error);
    return NextResponse.json(
      { error: 'Failed to submit viewing request' },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    await dbConnect();
    const requests = await ViewingRequest.find().sort({ createdAt: -1 });
    return NextResponse.json(requests);
  } catch (error) {
    console.error('Fetch viewing requests error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch viewing requests' },
      { status: 500 }
    );
  }
}
