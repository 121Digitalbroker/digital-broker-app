import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Property from '@/models/Property';

export async function GET() {
  await dbConnect();
  
  try {
    const properties = await Property.find({});
    let updatedCount = 0;
    
    for (const prop of properties) {
      if (!prop.slug) {
        const slugBase = `${prop.projectName}-${prop.sector || ''}-${prop.city}`.toLowerCase();
        const slug = slugBase
          .replace(/[^a-z0-9]+/g, '-') // Replace non-alphanumeric chars with hyphens
          .replace(/(^-|-$)+/g, ''); // Remove leading and trailing hyphens
          
        prop.slug = slug;
        await prop.save(); // This triggers the pre-save hook, but we manually set it just in case
        updatedCount++;
      }
    }
    
    return NextResponse.json({ success: true, updatedCount });
  } catch (error) {
    return NextResponse.json({ success: false, error: String(error) }, { status: 500 });
  }
}
