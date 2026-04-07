import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import YamunaBanner from '@/models/YamunaBanner';

// PATCH — Update a banner
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await dbConnect();
    const { id } = await params;
    const body = await request.json();
    const updated = await YamunaBanner.findByIdAndUpdate(id, body, { new: true });

    if (!updated) {
      return NextResponse.json({ error: 'Banner not found' }, { status: 404 });
    }
    return NextResponse.json(updated);
  } catch (error: any) {
    console.error('❌ Update banner error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// DELETE — Remove a banner
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await dbConnect();
    const { id } = await params;
    const deleted = await YamunaBanner.findByIdAndDelete(id);

    if (!deleted) {
      return NextResponse.json({ error: 'Banner not found' }, { status: 404 });
    }
    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('❌ Delete banner error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
