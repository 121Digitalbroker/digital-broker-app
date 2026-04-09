import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Property from '@/models/Property';

export async function GET(request: Request) {
  try {
    await dbConnect();
    const { searchParams } = new URL(request.url);

    const type = searchParams.get('type');
    const category = searchParams.get('category');
    const minPrice = searchParams.get('minPrice');
    const maxPrice = searchParams.get('maxPrice');
    const bedrooms = searchParams.get('bedrooms'); // '1', '2', '3', '4+' or 'All'
    const minSqft = searchParams.get('minSqft');
    const maxSqft = searchParams.get('maxSqft');
    const q = searchParams.get('q');
    const promoted = searchParams.get('promoted');
    const showOnYamunaExpressway = searchParams.get('showOnYamunaExpressway');

    let andConditions: any[] = [];
    
    if (q && q.trim() !== '') {
      const escapedQ = q.trim().replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      andConditions.push({
        $or: [
          { projectName: { $regex: escapedQ, $options: 'i' } },
          { city: { $regex: escapedQ, $options: 'i' } },
          { sector: { $regex: escapedQ, $options: 'i' } },
          { developerName: { $regex: escapedQ, $options: 'i' } }
        ]
      });
    }

    if (type && type !== 'All') {
      andConditions.push({ propertyType: { $in: [type, 'both'] } });
    }
    
    // Category mapping
    if (category && category !== 'All') {
       andConditions.push({
         $or: [
           { 'commercialConfigs.commercialType': category },
           { 'residentialConfigs.typology': category },
           { 'category': category }
         ]
       });
    }

    // Since min/max price & sqft apply to two different config arrays, we construct dynamic checks
    if (minPrice || maxPrice) {
      let priceQ: any = {};
      if (minPrice && minPrice.trim() !== '') priceQ.$gte = Number(minPrice);
      if (maxPrice && maxPrice.trim() !== '') priceQ.$lte = Number(maxPrice);
      
      if (Object.keys(priceQ).length > 0) {
        andConditions.push({
          $or: [
            { 'residentialConfigs.ticketSize': priceQ },
            { 'commercialConfigs.ticketSize': priceQ }
          ]
        });
      }
    }

    if (minSqft || maxSqft) {
      let sqftQ: any = {};
      if (minSqft && minSqft.trim() !== '') sqftQ.$gte = Number(minSqft);
      if (maxSqft && maxSqft.trim() !== '') sqftQ.$lte = Number(maxSqft);
      
      if (Object.keys(sqftQ).length > 0) {
        andConditions.push({
          $or: [
            { 'residentialConfigs.unitSize': sqftQ },
            { 'commercialConfigs.unitSize': sqftQ },
            { projectSize: sqftQ }
          ]
        });
      }
    }

    // Bedrooms mapping ('All', '1', '2', '3', '4+') -> '2BHK', '3BHK', etc.
    if (bedrooms && bedrooms !== 'All') {
       let typologyMap: any = null;
       if (bedrooms === '2') typologyMap = '2BHK';
       if (bedrooms === '3') typologyMap = '3BHK';
       if (bedrooms === '4+') typologyMap = '4BHK';

       if (typologyMap) {
         andConditions.push({ 'residentialConfigs.typology': typologyMap });
       }
    }

    // Promoted filter
    if (promoted === 'true') {
      andConditions.push({ isPromoted: true });
    }

    // Yamuna Expressway filter
    if (showOnYamunaExpressway === 'true') {
      andConditions.push({ showOnYamunaExpressway: true });
    }

    // Visibility filter (Default: only show visible properties)
    const adminAccess = searchParams.get('adminAccess');
    if (adminAccess !== 'true') {
      andConditions.push({ isVisible: { $ne: false } });
    }

    let query = {};
    if (andConditions.length > 0) {
      query = { $and: andConditions };
    }

    const properties = await Property.find(query).sort({ createdAt: -1 });
    return NextResponse.json(properties);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    await dbConnect();
    const body = await request.json();
    const property = await Property.create(body);
    return NextResponse.json(property, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
