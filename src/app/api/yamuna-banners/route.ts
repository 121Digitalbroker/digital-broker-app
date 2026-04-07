import { NextRequest, NextResponse } from 'next/server';
export const dynamic = 'force-dynamic';
import dbConnect from '@/lib/mongodb';
import YamunaBanner from '@/models/YamunaBanner';

const defaultSlides = [
  { image: "/uploads/airport.jpg", title: "India's Biggest Airport", order: 0 },
  { image: "https://images.unsplash.com/photo-1473839224629-f424603490b2?q=80&w=2670&auto=format&fit=crop", title: "India's Biggest Multi Modal Transport Hub", order: 1 },
  { image: "https://images.unsplash.com/photo-1485846234645-a62644f84728?q=80&w=2670&auto=format&fit=crop", title: "India's Most Innovative Hi-Tech City Film City", order: 2 },
  { image: "https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=2670&auto=format&fit=crop", title: "India's Biggest Hub for Upcoming SemiConductor Industries", order: 3 },
  { image: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?q=80&w=2670&auto=format&fit=crop", title: "India's Biggest Education Hub", order: 4 },
  { image: "https://images.unsplash.com/photo-1545558014-8692077e9b5c?q=80&w=2670&auto=format&fit=crop", title: "On India's Premium Greenfield Expressway", order: 5 }
];

// GET — Fetch all banners sorted by order
export async function GET() {
  try {
    await dbConnect();
    let banners = await YamunaBanner.find().sort({ order: 1, createdAt: -1 });

    if (banners.length === 0) {
      await YamunaBanner.insertMany(defaultSlides);
      banners = await YamunaBanner.find().sort({ order: 1 });
    }

    return NextResponse.json(banners);
  } catch (error: any) {
    console.error('❌ Fetch banners error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// POST — Create a new banner
export async function POST(request: NextRequest) {
  try {
    await dbConnect();
    const body = await request.json();

    if (!body.image || !body.title) {
      return NextResponse.json(
        { error: 'Image and title are required' },
        { status: 400 }
      );
    }

    // Auto-assign order if not provided
    if (body.order === undefined) {
      const count = await YamunaBanner.countDocuments();
      body.order = count;
    }

    const banner = await YamunaBanner.create(body);
    return NextResponse.json(banner, { status: 201 });
  } catch (error: any) {
    console.error('❌ Create banner error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
