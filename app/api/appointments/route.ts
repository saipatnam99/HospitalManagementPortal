import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';

const prisma: PrismaClient = new PrismaClient();

export async function POST(req: Request) {
  try {
    const {
      date,
      time,
      // patient,
      // doctor,
      patientId, doctorId
      // firstName,
      // lastName,
      // gender,
      // phone,
      // address,
      // addressLine2,
      // city,
      // state,
      // postalCode,
      // email,
      // appliedBefore,
      // department,
      // procedure,
      // preferredDate,
      // preferredTime,
    } = await req.json();

    const newAppointment = await prisma.appointment.create({
      data: {
        date : new Date(date),
        time,
      //  patient,
        patientId,
      //  doctor,
        doctorId
        // firstName,
        // lastName,
        // gender,
        // phone,
        // address,
        // addressLine2,
        // city,
        // state,
        // postalCode,
        // email,
        // appliedBefore: appliedBefore === 'yes' ,
        // department,
        // procedure,
        // preferredDate: new Date(preferredDate), // Convert date string to Date object
        // preferredTime,
      },
    });
    console.log(newAppointment)
    

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

// export const GET = async () => {
//   try {
//     const appointments = await prisma.appointment.findMany();
//     return new NextResponse(JSON.stringify(appointments), { status: 200 });
//   } catch (error) {
//     return new NextResponse("Error in fetching appointments: " + error, {
//       status: 500,
//     });
//   }
// };




export async function GET() {
  try {
    const appointments = await prisma.appointment.findMany({
      include: {
        patient: {
          select: {
            firstName: true,
            lastName: true,
          },
        },
        doctor: {
          select: {
            
            fullName: true,
            specialization: true,
          },
        },
      },
    });

    return NextResponse.json(appointments, { status: 200 });
  } catch (error) {
    console.error("Error in fetching appointments:", error);
    return new NextResponse(
      JSON.stringify({ message: "Error in fetching appointments", error }),
      { status: 500 }
    );
  }
}



