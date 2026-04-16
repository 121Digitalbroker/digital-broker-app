import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Property from '@/models/Property';

export async function GET() {
  try {
    await dbConnect();
    const p = await Property.findById('69d4a557348952a51e5d849b');
    
    if (!p) return NextResponse.json({ error: 'Property 69d4a557348952a51e5d849b not found' });

    if (p.residentialConfigs) {
      p.residentialConfigs = p.residentialConfigs.map((c: any) => {
        // Set Servant Room to 1 for 4BHK and 3BHK for this test
        if (c.typology === '4BHK' || c.typology === '3BHK') {
          return { ...c, servantRooms: 1 };
        }
        return c;
      });
      
      p.markModified('residentialConfigs');
      await p.save();
    }

    return NextResponse.json({ 
      success: true, 
      message: 'Database updated! 3BHK and 4BHK now have Servant Rooms set. Refresh the property page now.' 
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message });
  }
}
