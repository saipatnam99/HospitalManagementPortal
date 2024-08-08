
import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';
const prisma = new PrismaClient();

export const GET = async (request: Request) => {
  try {
    const doctors = await prisma.doctor.findMany();
    return new NextResponse(JSON.stringify(doctors), { status: 200 })
  } catch (error) {
    return new NextResponse("Error in fetching categories" + error, {
      status: 500,
    })

  }
};

// export const POST = async (request: Request) => {
//   try {
//     const body = await request.json();
//     //const { name } = body;
//     const { fullName, email, phone, specialization, experience, address } = body;

//     // const newDoctor = await prisma.doctor.create({
//     //   data: {...body}
//     // });

//     const newDoctor = await prisma.doctor.create({
//       data: {

//         fullName,
//         email,
//         phone,
//         specialization,
//         experience,
//         address
//       },
//     });

//     return new NextResponse(
//       JSON.stringify({ message: "Doctor is Added", doctor: newDoctor }),
//       { status: 200 }
//     );
//   } catch (error) {
//     return new NextResponse(
//       JSON.stringify({
//         message: "Error in addind Doctor",
//         error,
//       }),
//       {
//         status: 500,
//       }
//     );
//   }
// };

export async function POST(req: Request) {
  const { email, fullName, phone, address, experience, specialization } = await req.json();

  // Hash password
  // const hashedPassword = await bcrypt.hash(password, 10);

  try {
    const newDoctor = await prisma.doctor.create({
      data: {
        email,
        fullName,
        phone,
        experience,
        specialization,
        address,
      },
    });
    return new NextResponse(
      JSON.stringify({ message: "Doctor is Added", doctor: newDoctor }),
      { status: 200 }
    );
  } catch (error) {
    return new NextResponse(
      JSON.stringify({
        message: "Error in adding Doctor",
        error,
      }),
      {
        status: 500,
      }
    );
  }
  //   return NextResponse.json({ newDoctor }, { status: 201 });
  // } catch (error) {
  //   return NextResponse.json({ message: 'Error creating doctor' }, { status: 500 });
  // }
}
