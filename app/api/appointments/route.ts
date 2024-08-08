import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function POST(req: Request) {
  try {
    const {
      firstName,
      lastName,
      gender,
      phone,
      address,
      addressLine2,
      city,
      state,
      postalCode,
      email,
      appliedBefore,
      department,
      procedure,
      preferredDate,
      preferredTime,
    } = await req.json();

    const newAppointment = await prisma.appointment.create({
      data: {
        firstName,
        lastName,
        gender,
        phone,
        address,
        addressLine2,
        city,
        state,
        postalCode,
        email,
        appliedBefore: appliedBefore === 'yes' ,
        department,
        procedure,
        preferredDate: new Date(preferredDate), // Convert date string to Date object
        preferredTime,
      },
    });

    return new NextResponse(
      JSON.stringify({ message: "Appointment is Added", appointment: newAppointment }),
      { status: 200 }
    );
  } catch (error) {
    return new NextResponse(
      JSON.stringify({
        message: "Error in adding Appointment",
        error,
      }),
      {
        status: 500,
      }
    );
  }
}

export const GET = async () => {
    try {
      const appointments = await prisma.appointment.findMany();
      return new NextResponse(JSON.stringify(appointments), { status: 200 });
    } catch (error) {
      return new NextResponse("Error in fetching appointments: " + error, {
        status: 500,
      });
    }
  };
