import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Property from '@/models/Property';

export async function POST() {
  try {
    await dbConnect();
    
    const comm1 = {
      developerName: 'M3M',
      projectName: 'M3M The Line Noida',
      city: 'Noida',
      sector: 'Sector 72',
      projectSize: 3,
      reraNumber: 'UPRERAPRJ123456',
      projectStatus: 'New Launch',
      propertyType: 'commercial',
      commercialConfigs: [{
        commercialType: 'Retail',
        unitSize: 500,
        pricePerSqft: 25000,
        leaseYears: 9,
        assuredReturnPct: 12,
        preLeased: true,
        ticketSize: 12500000
      }],
      productImages: ['https://images.unsplash.com/photo-1574958269340-fa927503f3dd?q=80&w=2670&auto=format&fit=crop'],
      isFeatured: true,
      isPromoted: false,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const comm2 = {
      developerName: 'Bhutani',
      projectName: 'Bhutani Cyberthum',
      city: 'Noida',
      sector: 'Sector 140A',
      projectSize: 26,
      reraNumber: 'UPRERAPRJ234567',
      projectStatus: 'Under Construction',
      propertyType: 'commercial',
      commercialConfigs: [{
        commercialType: 'Office',
        unitSize: 1000,
        pricePerSqft: 10000,
        leaseYears: 5,
        assuredReturnPct: 10,
        preLeased: false,
        ticketSize: 10000000
      }],
      productImages: ['https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=2670&auto=format&fit=crop'],
      isFeatured: true,
      isPromoted: false,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const comm3 = {
      developerName: 'Supertech',
      projectName: 'Supertech Supernova',
      city: 'Noida',
      sector: 'Sector 94',
      projectSize: 17,
      reraNumber: 'UPRERAPRJ456789',
      projectStatus: 'Ready To Move',
      propertyType: 'commercial',
      commercialConfigs: [{
        commercialType: 'Studio',
        unitSize: 600,
        pricePerSqft: 15000,
        leaseYears: 3,
        assuredReturnPct: 12,
        preLeased: true,
        ticketSize: 9000000
      }],
      productImages: ['https://images.unsplash.com/photo-1504307651254-35680f356bfb?q=80&w=2670&auto=format&fit=crop'],
      isFeatured: true,
      isPromoted: false,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    await Property.insertMany([comm1, comm2, comm3]);
    return NextResponse.json({ message: "Seeded commercial properties" }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
