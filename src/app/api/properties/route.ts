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
    
    // Additional parameters we can just parse to show they're accepted
    // const floors = searchParams.get('floors');
    // const condition = searchParams.get('condition');
    
    let query: any = {};
    
    if (type && type !== 'All') {
      query.propertyType = { $in: [type, 'both'] };
    }
    
    // Category mapping
    if (category && category !== 'All') {
       // Just a relaxed fuzzy match since actual schema uses "typology" and "commercialType"
       // We'll just leave it out to not break results if it doesn't match perfectly,
       // or we can query against a 'category' field if it was added. 
       // For now, if the user explicitly clicks a category we could try:
       // query.$or = [{ 'residentialConfigs.typology': category }, { 'commercialConfigs.commercialType': category }];
    }

    // Since min/max price & sqft apply to two different config arrays, we construct dynamic checks
    if (minPrice || maxPrice) {
      let priceQ: any = {};
      if (minPrice && minPrice.trim() !== '') priceQ.$gte = Number(minPrice);
      if (maxPrice && maxPrice.trim() !== '') priceQ.$lte = Number(maxPrice);
      
      if (Object.keys(priceQ).length > 0) {
        query.$or = [
          { 'residentialConfigs.ticketSize': priceQ },
          { 'commercialConfigs.ticketSize': priceQ }
        ];
      }
    }

    if (minSqft || maxSqft) {
      let sqftQ: any = {};
      if (minSqft && minSqft.trim() !== '') sqftQ.$gte = Number(minSqft);
      if (maxSqft && maxSqft.trim() !== '') sqftQ.$lte = Number(maxSqft);
      
      if (Object.keys(sqftQ).length > 0) {
        const sqftOr = [
          { 'residentialConfigs.unitSize': sqftQ },
          { 'commercialConfigs.unitSize': sqftQ },
          { projectSize: sqftQ }
        ];
        
        if (query.$or) {
          // If we already have price OR, we need to wrap in $and
          query = {
             $and: [
                { $or: query.$or },
                { $or: sqftOr }
             ]
          };
          delete query.$or;
        } else {
          query.$or = sqftOr;
        }
      }
    }

    // Bedrooms mapping ('All', '1', '2', '3', '4+') -> '2BHK', '3BHK', etc.
    if (bedrooms && bedrooms !== 'All') {
       let typologyMap: any = null;
       if (bedrooms === '2') typologyMap = '2BHK';
       if (bedrooms === '3') typologyMap = '3BHK';
       if (bedrooms === '4+') typologyMap = '4BHK';
       
       if (typologyMap) {
         query['residentialConfigs.typology'] = typologyMap;
       }
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
