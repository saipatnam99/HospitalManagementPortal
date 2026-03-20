// import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';
import { prisma } from "@/lib/prisma";
// const prisma = new PrismaClient();

export async function POST(req: Request) {
  try {
    const { date, time, patientId, doctorId } = await req.json();

    const patient = await prisma.patient.findUnique({ where: { id: patientId } });
    const doctor = await prisma.doctor.findUnique({ where: { id: doctorId } });

    if (!patient || !doctor) {
      throw new Error("Invalid patient or doctor ID");
    }

    if (!patient.phone) {
      throw new Error("Patient phone number is missing");
    }

    const newAppointment = await prisma.appointment.create({
      data: {
        date: new Date(date),
        time,
        patientId,
        doctorId,
      },
    });

    console.log(patient.phone);

    return NextResponse.json(
      { message: "Appointment added successfully", appointment: newAppointment },
      { status: 200 }
    );
  } catch (error) {
    if (error instanceof Error) {
      console.error("Error in adding appointment:", error.message);
      return NextResponse.json(
        { message: "Error in adding Appointment", error: error.message },
        { status: 500 }
      );
    } else {
      console.error("Unknown error in adding appointment:", error);
      return NextResponse.json(
        { message: "Unknown error in adding Appointment" },
        { status: 500 }
      );
    }
  }
}

// export async function GET() {
//   try {
//     const appointments = await prisma.appointment.findMany({
//       include: {
//         patient: {
//           select: {
//             firstName: true,
//             lastName: true,
//             phone: true,
//           },
//         },
//         doctor: {
//           select: {
//             fullName: true,
//             specialization: true,
//           },
//         },
//       },
//     });

//     return NextResponse.json(appointments, { status: 200 });
//   } catch (error) {
//     if (error instanceof Error) {
//       console.error("Error in fetching appointments:", error.message);
//       return NextResponse.json(
//         { message: "Error in fetching appointments", error: error.message },
//         { status: 500 }
//       );
//     } else {
//       console.error("Unknown error in fetching appointments:", error);
//       return NextResponse.json(
//         { message: "Unknown error in fetching appointments" },
//         { status: 500 }
//       );
//     }
//   }
// }

export async function GET() {
  try {
    const appointments = await prisma.appointment.findMany({
      include: {
        patient: {
          select: {
            firstName: true,
            lastName: true,
            phone: true,
          },
        },
        doctor: {
          select: {
            fullName: true,
            specialization: true,
          },
        },
      },
      orderBy: {
        date: "desc",
      },
    });

    // ✅ Transform data for frontend
    const formattedAppointments = appointments.map((appt) => ({
      id: appt.id,

      patientName: `${appt.patient.firstName} ${appt.patient.lastName}`,
      doctorName: appt.doctor.fullName,

      date: appt.date,
      time: appt.time,

      // ✅ formatted datetime
      dateTime: new Date(appt.date).toLocaleString("en-IN", {
        dateStyle: "medium",
        timeStyle: "short",
      }),

      specialization: appt.doctor.specialization,
      phone: appt.patient.phone,
    }));

    return NextResponse.json(formattedAppointments, { status: 200 });
  } catch (error) {
    console.error("Error fetching appointments:", error);
    return NextResponse.json([], { status: 500 });
  }
}
