import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';
import { sendSms } from '@/utils/sms'

const prisma: PrismaClient = new PrismaClient();





export async function POST(req: Request) {
  try {
    const { date, time, patientId, doctorId } = await req.json();

    // Fetch patient and doctor details
    const patient = await prisma.patient.findUnique({
      where: { id: patientId },
    });

    const doctor = await prisma.doctor.findUnique({
      where: { id: doctorId },
    });

    if (!patient || !doctor) {
      throw new Error("Invalid patient or doctor ID");
    }

    if (!patient.phone) {
      throw new Error("Patient phone number is missing");
    }

    // Create the new appointment
    const newAppointment = await prisma.appointment.create({
      data: {
        date: new Date(date),
        time,
        patientId,
        doctorId,
      },
    });

    // Construct the SMS message
    const message = `Dear ${patient.firstName} ${patient.lastName}, your appointment is scheduled on ${date} at ${time} with Dr. ${doctor.fullName}. Thank you!`;

    // Send SMS notification
    await sendSms(patient.phone, message);
    console.log(patient.phone)

    // Return the created appointment with a success status
    return NextResponse.json(
      { message: "Appointment added successfully", appointment: newAppointment },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error in adding appointment:", error);

    return NextResponse.json(
      {
        message: "Error in adding Appointment",
        error
      },
      { status: 500 }
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
            phone:true,
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



